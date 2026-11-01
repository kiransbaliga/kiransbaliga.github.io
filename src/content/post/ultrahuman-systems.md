---
title: "Ultrahuman: Clinical LLM Pipelines"
description: "Clinical reporting across 10+ lab stations: asynchronous ingestion, LLM analysis, clinician review and 15-page health plan generation."
publishDate: "15 Jun 2026"
pinned: true
tags: ["case-study", "systems", "ai", "architecture"]
---

Ultrahuman engineers metabolic and longevity hardware—including the Ring AIR smart ring and the Blood Vision biomarker platform—serving over 5 million users globally. Beyond wearable telemetry, the platform interfaces with specialized performance clinical labs, translating multi-station physiological diagnostics into clinically validated, personalized health protocols.

As a Backend Engineer within a 16-person core engineering team, I worked in a 3-person health reporting group owning the end-to-end clinical AI report-generation pipeline. I also contributed to porting vital computation to on-device Kotlin Multiplatform, engineering platform-wide localization infrastructure, and building behavioral recommendation pipelines.

---

## The Architectural Challenge

Translating raw human physiology into comprehensive medical reports involves severe systems constraints:

1. **Heterogeneous, Asynchronous Diagnostic Arrival**: Complete client assessments span 10 to 15 disparate diagnostic stations—including DEXA body composition scans, VO₂ max cardio-respiratory testing, continuous glucose monitors (CGM), blood biomarker panels, and gut microbiome sequencing. Results do not arrive in unison: REST APIs transmit immediately, while third-party blood lab PDFs and culture sequences arrive asynchronously days later.
2. **Clinical Safety & Doctor-in-the-Loop Validation**: Autonomous generative models cannot serve as the final medical authority without qualified physician sign-off. When a clinician edits or refines a dietary or biomarker recommendation, re-running the entire 15–20 page document introduces non-deterministic drift across previously approved sections, high token costs, and 45–60 second latency stalls.
3. **Cloud Batch Queue Latency for Ring Vitals**: Core recovery and sleep metrics were initially computed centrally in scheduled server batch jobs on Ruby on Rails workers. Ring wearers waking up without active internet connections suffered delayed score delivery.
4. **Platform-Wide App & Web CJK Localization**: Standard machine translation models consistently failed on nuanced Chinese, Japanese, and Korean (CJK) scripts across the mobile applications and web platform, causing terminology drift in medical metrics and trademark transliteration errors.

---

## Architecture & Implementation

```
[10-15 Lab Stations] (DEXA, VO2 Max, Biomarkers, CGM, Gut Labs)
         │ (REST APIs, Asynchronous Lab Feeds, OCR'd PDFs)
         ▼
[Ingestion & Normalization DAG] ──► [Biomarker Schema & Validation]
         │
         ▼
[Deterministic Guardrails Matrix] ──► [Domain Knowledge Prompt Layers]
         │
         ▼
[Modular Section Generation] (Metabolic, Cardio, Biomarkers, Protocols)
         │
         ▼
[Clinician Review Interface] ──(Comments / Edits)──► [Scoped Section Diff Engine]
         │ (Physician Sign-Off)                               │
         ▼                                                    ▼
[Final 15-20 Page Health Plan PDF] ◄────── [Targeted Section Re-generation]
```

### 1. Dynamic Ingestion DAG & Unified Biomarker Schema

To handle multi-station lab feeds arriving asynchronously, we designed an event-driven directed acyclic graph (DAG) runner:

- **Unified Clinical Schema**: Every station payload (whether a direct JSON webhook from a metabolic cart or parsed tabular data from an external lab PDF) is normalized into a strictly typed biomarker schema with unit standardization (e.g., standardizing `mg/dL` vs `mmol/L` glucose readings and fasting status).
- **Non-Blocking Station Accumulator**: The pipeline tracks incoming station readiness per user workspace. Once prerequisite diagnostic anchors are verified, intermediate analytical modules execute without waiting for non-blocking secondary tests.
- **Deterministic Boundary Matrices**: Before passing clinical data to LLM analysis, values are cross-checked against strict physiological boundary rules. The model is constrained to cite specific biomarker ranges, eliminating hallucinated clinical values.

### 2. Clinician-in-the-Loop & Scoped Section Regeneration

Generating 15–20 page personalized health plans required a modular decomposition rather than a monolithic prompt:

- **Decomposed Generation Graph**: The document is partitioned into discrete domain sub-graphs: Metabolic Dynamics, Cardiovascular Performance, Sleep Architecture, Biomarker Variance, and Actionable Nutrition/Supplement Protocols.
- **Interactive Review Loop**: In the clinician portal, physicians inspect generated findings side-by-side with raw lab outputs. Doctors can highlight specific recommendations, add clinical annotations, or request alterations (e.g., adjusting a training threshold for an athlete with high systemic inflammation).
- **Scoped Diff Engine**: When a doctor requests an adjustment on a single section, the pipeline triggers targeted sub-graph regeneration. Only the isolated section is re-prompted with the doctor's feedback and contextual constraints, leaving the remainder of the 15-page document bit-for-bit unchanged. This reduced revision turnaround time from minutes to under 3 seconds.

```ruby
# Scoped section regeneration worker pattern
class ClinicalReportSectionRegenerator
  def execute(report_id:, section_key:, clinician_notes:)
    report = ClinicalReport.find(report_id)
    cached_context = report.normalized_biomarker_context
    section_config = ReportSectionRegistry.fetch(section_key)

    # Re-generate ONLY the flagged section node
    prompt = ClinicalPromptBuilder.new(
      context: cached_context,
      section: section_config,
      feedback: clinician_notes,
      clinical_rules: section_config.deterministic_rules
    ).build

    revised_content = LLMClient.generate_structured(
      prompt: prompt,
      schema: section_config.output_schema
    )

    report.with_lock do
      report.sections[section_key] = revised_content
      report.audit_trail.record!(
        section: section_key,
        actor: Current.user,
        diff: report.diff_for(section_key)
      )
      report.save!
    end
  end
end
```

### 3. Edge Vital Computation via Kotlin Multiplatform (KMP)

To eliminate cloud batch processing latency for core ring metrics, we contributed to moving sleep and recovery score calculation directly onto wearer devices:

- **Ruby to KMP Algorithm Port**: Core mathematical models originally executing in backend Ruby worker pools were rewritten in Kotlin Multiplatform (KMP), enabling a single shared codebase to run natively inside iOS and Android applications.
- **Empirical Parity Harness**: Before pushing to production wearers, we built an automated parity test suite executing server and device implementations against historical multi-terabyte wearer datasets. We achieved **99–100% mathematical parity** across millions of biometric data points.
- **Zero-Network Computation**: Wearers immediately receive recovery metrics upon Bluetooth sync, cutting vital computation latency by ~80% and unlocking 100% offline capability.

### 4. High-Fidelity CJK Localization Pipeline

In parallel with clinical reporting, I engineered a dedicated platform-wide localization pipeline powering user-facing applications and web portals in Chinese, Japanese, and Korean:

- **Split-Translation Passes**: The pipeline isolates domain context extraction from grammatical script synthesis. Pass 1 analyzes UI string context, intent, and platform variables; Pass 2 synthesizes native CJK grammar adhering to regional technical vernacular.
- **Curated Domain Glossaries**: Injected strict terminology dictionaries for medical terminology, physiological indicators, and trademarked names (e.g., Ultrahuman Ring AIR, Blood Vision, Powerplugs).
- **Prompt Caching**: By leveraging Anthropic prompt caching on static system guidelines and reference medical glossaries, recurring token costs plummeted by **67%**, while agency-reviewed localization quality jumped from **86% to 91%** (reaching 93% for Simplified Chinese).

---

## Quantified Impact

| Engineering Track                   | Metric Before                  | Metric After / Measured Outcome                               |
| :---------------------------------- | :----------------------------- | :------------------------------------------------------------ |
| **Health Computation Latency**      | Multi-second cloud batch queue | **~80% reduction** (Instant on-device KMP execution)          |
| **Edge Computation Parity**         | N/A (Server-only)              | **99%–100% parity** verified on real wearer datasets          |
| **Clinical Report Scope**           | Manual authoring (Hours)       | **15–20 page** structured, doctor-approved documents          |
| **Physician Revision Turnaround**   | Full document re-run (~60s)    | **< 3s** scoped section regeneration                          |
| **CJK Platform Localization**       | 86% quality baseline           | **91% overall quality** (93% Simplified Chinese agency score) |
| **Translation Token Expense**       | 100% un-cached overhead        | **~67% token cost cut** via prompt caching                    |
| **Cross-Product Behavioral Upsell** | Static promotional banners     | **8,000+ conversions** in 60 days via cohort engine           |
| **Platform Scale**                  | Multi-tenant cluster           | **5M+ core active users** supported                           |

---

## Key Takeaways

1. **Deterministic Boundaries Prevent LLM Hallucination**: In regulated health applications, never feed unvalidated diagnostic feeds straight to an LLM. Pre-filtering inputs through strongly typed boundary matrices ensures the model operates strictly as a synthesis and formatting engine rather than an unconstrained diagnostic authority.
2. **Modular Graph Architecture Beats Monolithic Prompts**: Monolithic generation of large documents is fragile, expensive, and slow. Partitioning documents into isolated nodes with targeted diff-and-regenerate primitives creates a responsive, audit-ready clinician workflow.
3. **Edge Execution for Mission-Critical Vitals**: Moving core biometric calculations to edge devices via Kotlin Multiplatform eliminates cloud infrastructure costs and guarantees a seamless offline user experience.
