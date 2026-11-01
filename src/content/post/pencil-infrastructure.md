---
title: "Pencil: AI Ad Infrastructure & Data Layer"
description: "Reworking the data layer and PDF pipeline behind a multi-tenant AI ad platform with strict infrastructure-level tenant boundaries."
publishDate: "10 Feb 2026"
pinned: true
tags: ["case-study", "systems", "performance"]
---

Pencil is an enterprise B2B generative AI advertising platform used by major global consumer brands and agencies to generate, predict, and scale high-performing ad creatives. During peak seasonal marketing campaigns, the platform processes heavy creative generation workloads and analytics pipelines, peaking at over 14,200 requests per second.

As a Backend & Systems Engineer at KeyValue Software Systems, I worked on overhauling Pencil's core data layer, refactoring monolithic microservices into event-driven processing, and re-architecting the high-resolution creative export and PDF generation infrastructure.

---

## Architectural Bottlenecks

As Pencil expanded from early-stage teams to Fortune 500 enterprise accounts, two foundational architectural bottlenecks emerged:

### 1. Relational Rigidity & Multi-Tenant Schema Contention

Enterprise clients require distinct taxonomy: custom campaign metadata, internal compliance approval workflows, proprietary audience tags, and localized legal disclaimers.

Under the original relational schema:

- Introducing tenant-specific custom fields required manual database migrations (DDL changes) across shared production tables.
- Running DDL migrations on high-velocity production tables created table locks and deployment friction.
- Cross-tenant queries competed for shared connection pools without strict infrastructure-level isolation, risking performance degradation during noisy-neighbor events.

### 2. Client-Side PDF & Creative Proof Generation

Enterprise creative directors and legal teams routinely export multi-page campaign decks, storyboard proofs, and high-resolution print-ready ad variations.

The legacy implementation performed rendering directly inside client web browsers using client-side canvas rasterization and DOM-to-PDF scripts:

- **Font & Asset Dropping**: Custom brand typography frequently failed to load or was silently substituted with fallback fonts depending on local operating system permissions and CORS restrictions.
- **Visual Drift**: Renderings differed across operating systems, screen pixel densities (Retina vs standard DPI), and browser versions, causing millimeter-level layout misalignment in legal disclaimers.
- **Client Resource Exhaustion**: Large 20-page creative decks froze browser tabs, consuming 100% CPU on user machines and stalling for 8 to 15 seconds before failing due to browser memory limits.

---

## Architecture & Solutions

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                REST / GraphQL Requests
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway & Custom ORM Layer                 │
│  - Automated Tenant Scoping (workspace_id injection)        │
│  - Dynamic Metadata Schema Validation (JSON Schema)         │
│  - Enterprise RBAC & Hierarchy Enforcement                  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
         Queries & Mutates             Enqueues Export
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Google Cloud SQL        │ │    Message Broker (Queue)   │
│  - Partitioned Postgres DB   │ └────────────┬───────────────┘
│  - JSONB Metadata Columns    │              │
│  - PgBouncer Pooling         │              ▼
└──────────────────────────────┘ ┌────────────────────────────┐
                                 │ Headless Puppeteer Workers  │
                                 │ - Containerized Chromium    │
                                 │ - Pre-bundled Brand Fonts   │
                                 │ - Stream to Cloud Storage   │
                                 └────────────┬───────────────┘
                                              │
                                              ▼
                                 ┌────────────────────────────┐
                                 │  Signed Download URL (~1.5s)│
                                 └────────────────────────────┘
```

### 1. Metadata-Driven Multi-Tenant Data Layer

To support heterogeneous enterprise requirements without recurring DDL migrations, we architected an extensible, typed metadata layer:

- **Structured JSONB with Schema Enforcement**: Dynamic client fields were modeled into PostgreSQL JSONB columns governed by strict JSON Schema definitions validated at the application boundaries. Enterprise administrators can define custom typed fields (strings, dropdown enums, numerical budgets, relational lookups) on the fly.
- **Tenant-Scoped Custom ORM**: We built a custom query abstraction that intercepts all database operations. It automatically injects strict `tenant_id` boundaries and tenant-specific access rules into every generated query, eliminating accidental cross-tenant data leaks at the compile and runtime levels.
- **Migration to Google Cloud SQL**: We contributed to migrating high-scale enterprise workspaces to Google Cloud SQL with optimized PgBouncer connection pooling and indexed table partitioning. Query latencies dropped by **30%** across core workspace dashboards.

```typescript
// Tenant-scoped metadata validation pattern
export async function createCreativeRecord(
	ctx: TenantContext,
	payload: CreateCreativeInput,
): Promise<CreativeRecord> {
	const { workspaceId, userRole } = ctx;

	// 1. Fetch dynamic workspace schema definition
	const tenantSchema = await WorkspaceSchemaCache.get(workspaceId);

	// 2. Validate custom metadata against tenant-defined JSON schema
	const validator = compileJsonSchema(tenantSchema.customMetadataRules);
	const isValid = validator(payload.customMetadata);

	if (!isValid) {
		throw new ValidationError(
			"Metadata failed workspace schema validation",
			validator.errors,
		);
	}

	// 3. Persist record with guaranteed tenant isolation
	return await db.transaction(async (trx) => {
		return trx("creatives")
			.withSchema(`tenant_${workspaceId}`)
			.insert({
				workspace_id: workspaceId,
				campaign_id: payload.campaignId,
				metadata: JSON.stringify(payload.customMetadata),
				created_by: ctx.userId,
				created_at: new Date(),
			})
			.returning("*");
	});
}
```

### 2. Headless Server-Side Rendering Fleet

We completely eliminated browser-side PDF generation, replacing it with an asynchronous, sandboxed rendering worker fleet:

- **Containerized Chromium Workers**: We deployed headless Puppeteer instances running within isolated Docker worker nodes. Each container contains pre-installed standard enterprise fonts, typography caches, and Cairo graphics rendering libraries.
- **Pixel-Perfect Print CSS**: Templates use standardized print CSS rules (`@page`, exact millimetric bleed margins, and CMYK/RGB color profiles). The rendering output is 100% deterministic regardless of whether the requesting user is on macOS, Windows, Linux, or mobile.
- **Asynchronous Asset Streaming**: Large export jobs are decoupled from HTTP request threads. When a user requests a multi-page PDF campaign deck, the API immediately returns a job ticket. A worker claims the job, loads the DOM template in headless Chromium, streams the generated PDF buffer directly to Google Cloud Storage (GCS), and dispatches a signed short-lived download URL.

```typescript
// Headless PDF worker pipeline
export async function renderHighResPdf(job: RenderJob): Promise<string> {
	const browser = await BrowserPool.acquire();
	const page = await browser.newPage();

	try {
		// Set precise print viewport and color emulation
		await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
		await page.emulateMediaType("print");

		// Load compiled template with pre-warmed auth tokens
		await page.setContent(job.htmlTemplate, {
			waitUntil: "networkidle0",
			timeout: 15000,
		});

		// Generate print-accurate vector PDF
		const pdfBuffer = await page.pdf({
			format: "A4",
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
		});

		// Stream directly to cloud storage
		const destinationPath = `exports/${job.workspaceId}/${job.id}.pdf`;
		await storageBucket.file(destinationPath).save(pdfBuffer, {
			contentType: "application/pdf",
			metadata: { cacheControl: "private, max-age=3600" },
		});

		return await storageBucket.file(destinationPath).getSignedUrl({
			action: "read",
			expires: Date.now() + 1000 * 60 * 30, // 30 minutes
		});
	} finally {
		await page.close();
		await BrowserPool.release(browser);
	}
}
```

### 3. Zero-Downtime Migration & Tenant Boundaries

Executing foundational schema restructuring on a high-velocity production platform required disciplined operational hygiene:

- **Dual-Write Architecture**: During the database migration phase, write operations were simultaneously mirrored to the legacy and newly partitioned schemas. Background reconciliation jobs validated write consistency.
- **Shadow Reads & Canary Releases**: Read queries were routed to the new Google Cloud SQL infrastructure for internal test accounts and canaried across enterprise cohorts before cutting over full production traffic.
- **Tenant-Level Feature Flags**: Every component of the new metadata and export pipelines was gated behind workspace-level feature flags, enabling rollbacks on a per-tenant basis without impacting platform-wide availability.

---

## Quantified Impact

| Metric / Workload             | Legacy Architecture              | Refactored Architecture      | Measured Impact                         |
| :---------------------------- | :------------------------------- | :--------------------------- | :-------------------------------------- |
| **PDF Generation Speed**      | 8–12 seconds in browser          | **~1.5 seconds** server-side | **65% faster** rendering throughput     |
| **Asset Export Latency**      | High client CPU stalls           | Asynchronous streaming       | **35%–40% drop** in export load times   |
| **API Response Times**        | Un-partitioned joins             | Cloud SQL + Custom ORM       | **30% faster** across workspace queries |
| **Peak Traffic Resilience**   | Connection saturation            | Scaled worker pool           | Handled **14.2k req/s** peak load       |
| **Enterprise Schema Agility** | Code changes & DDL migrations    | Dynamic JSON Schema metadata | **Zero downtime** schema customizations |
| **Visual Render Parity**      | Font substitution & margin drift | Containerized Chromium       | **100% deterministic** print layouts    |

---

## Key Takeaways

1. **Decouple Heavy Rendering from Application Servers**: Running compute-intensive or DOM-heavy tasks (like vector PDF compilation or video transcoding) inside HTTP worker processes starves connection pools. Moving them to asynchronous containerized queues with browser pooling preserves API responsiveness.
2. **Dynamic Schemas Need Strict Guardrails**: Giving enterprise tenants flexibility to create custom fields does not mean accepting an un-typed schema. Combining JSONB storage with compiled JSON Schema validators provides schema flexibility without sacrificing data integrity.
3. **Infrastructure-Level Tenant Isolation**: Relying on developers to remember `WHERE tenant_id = ?` in every raw query inevitably leads to data exposure bugs. Enforcing workspace boundaries within the core ORM layer guarantees bulletproof multi-tenant separation.
