export interface ArchitecturePreview {
  code: string;
  subhead: string;
  status: string;
  metrics: {
    label: string;
    value: string;
    progress: number;
  }[];
  pipelineNodes: {
    label: string;
    active?: boolean;
    color?: string;
  }[];
}

export interface CaseStudy {
  headline: string;
  summary: string;
  challenge: string;
  architecture: string[];
  results: string[];
  stackDetails: {
    technology: string;
    purpose: string;
  }[];
}

export interface ProjectData {
  id: string;
  category: string;
  categoryNumber: string;
  title: string;
  badge?: string;
  subtitle: string;
  description: string;
  image?: string;
  video?: string;
  mediaType: "image" | "video" | "interactive";
  link?: string;
  role: string;
  techStack: string[];
  architecture: ArchitecturePreview;
  caseStudy: CaseStudy;
}

export interface ExperienceData {
  year: string;
  company: string;
  position: string;
  description: string;
  tags: string[];
}

export const PORTFOLIO_CONFIG = {
  name: "KIRAN",
  fullName: "Kiran S Baliga",
  title: "Full Stack Developer & Backend Engineer",
  copyrightYear: "©2026",
  brand: "Kiran®",
  location: "Bangalore, India",
  timezone: "IST (UTC+5:30)",
  tagline: "I BUILD SYSTEMS THAT POWER THE PRODUCTS PEOPLE USE EVERY DAY",
  heroHeadline: "I build digital products.",
  heroSubline: "Engineering scalable backends and crafting thoughtful interfaces for ambitious teams.",
  availability: "AVAILABLE FOR FREELANCE & CONTRACTS",
  portraitImage: "/portfolio/kiran-portrait.png",
  contactCard: {
    badge: "Let's Talk",
    name: "Kiran",
    role: "Full Stack Developer",
    email: "kiransbaliga@gmail.com",
  },
  zentixHeroCard: {
    title: "※ ULTRAHUMAN",
    category: "/Backend Eng",
    deviceImage: "/portfolio/zentix-device.png",
  },
  socials: [
    { label: "GitHub", url: "https://github.com/kiransbaliga" },
    { label: "Twitter / X", url: "https://twitter.com/kiransbaliga" },
    { label: "LinkedIn", url: "https://linkedin.com/in/kiransbaliga" },
    { label: "Email", url: "mailto:kiransbaliga@gmail.com" },
    { label: "Blog", url: "https://baliga.dev" },
  ],
  navLinks: [
    { label: "Work", id: "selected-works" },
    { label: "Experience", id: "experience-section" },
    { label: "Contact", id: "footer" },
  ],
};

export const PROJECTS: ProjectData[] = [
  {
    id: "ultrahuman",
    categoryNumber: "01",
    category: "PRODUCT",
    title: "Ultrahuman Ring",
    badge: "PROD",
    subtitle: "AI-powered continuous biometrics & health engine",
    description: "Architected and scaled AI-powered health reporting and growth platforms serving 5M+ users with personalized biometric insights, sleep tracking, and recovery scores through automated LLM pipelines.",
    image: "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga/main/personal3.jpeg",
    mediaType: "interactive",
    link: "https://www.ultrahuman.com",
    role: "Backend Engineer",
    techStack: ["Ruby on Rails", "PostgreSQL", "LLM", "AWS", "Redis"],
    architecture: {
      code: "UH-BIOMETRICS-CORE",
      subhead: "Health Reporting & Growth Platform • 5M+ Users",
      status: "HEALTHY",
      metrics: [
        { label: "DAILY PROCESSED INSIGHTS", value: "5.2M / day", progress: 85 },
        { label: "P99 PIPELINE LATENCY", value: "84 ms", progress: 92 },
        { label: "LLM TRANSLATION RELIABILITY", value: "99.4%", progress: 99 },
      ],
      pipelineNodes: [
        { label: "● Wearable.stream()", color: "#d64c1b" },
        { label: "● LLM.analyze_biometrics()", active: true, color: "#d64c1b" },
        { label: "● QC_Validator.verify()", color: "#10b981" },
        { label: "● Cohort.upsell()", color: "#6366f1" },
      ],
    },
    caseStudy: {
      headline: "Scaling AI Health Reporting for 5 Million Global Users",
      summary: "Ultrahuman users rely on continuous metabolic data — HRV, sleep stages, temperature variance, and glucose curves. This platform automates the synthesis of multi-modal biometrics into actionable, clinical-grade daily reports and growth loops.",
      challenge: "Processing continuous biometric telemetry across millions of users while maintaining sub-second inference, strict fault isolation, and zero localization hallucination across 15+ target languages.",
      architecture: [
        "Event-driven background pipeline built with Ruby on Rails and sidekiq clusters processing raw telemetry streams into standardized timeseries tables.",
        "Asynchronous LLM summarization pipeline with automated quality control checks, reducing translation failures by ~67%.",
        "Dynamic cohort behavioural processing engine that tracks readiness patterns to trigger personalized interventions, driving 8,000+ conversions in 2 months.",
        "Zero-downtime schema evolution across high-throughput PostgreSQL databases with partitioned biometric history.",
      ],
      results: [
        "5M+ active users served daily with zero queue bottlenecks.",
        "~67% reduction in AI localization translation errors via automated quality gates.",
        "8k+ upsell conversions generated within 60 days of launch.",
        "Maintained 99.98% platform uptime during high-volume peak wear times.",
      ],
      stackDetails: [
        { technology: "Ruby on Rails", purpose: "Core API orchestration and transactional workflows" },
        { technology: "PostgreSQL", purpose: "Partitioned biometric data storage and indexing" },
        { technology: "LLM Workflows", purpose: "Automated synthesis of wearable insights into user prose" },
        { technology: "Redis & Sidekiq", purpose: "Distributed asynchronous processing queues" },
      ],
    },
  },
  {
    id: "siren-sdk",
    categoryNumber: "02",
    category: "DEVELOPER TOOLS",
    title: "Siren SDK",
    badge: "OSS",
    subtitle: "Communication rails & orchestration for AI agents",
    description: "Built core communication modules enabling multi-agent orchestration. Shipped JavaScript and Python SDKs, an MCP server, and adapters for OpenAI and CrewAI — reducing AI feature development time by ~80%.",
    mediaType: "interactive",
    link: "https://github.com/kiransbaliga",
    role: "Lead Engineer",
    techStack: ["TypeScript", "Python", "MCP", "FastAPI", "CI/CD"],
    architecture: {
      code: "SIREN-MCP-ROUTER",
      subhead: "Multi-Agent Protocol Engine • NPM & PyPI Distributed",
      status: "ACTIVE",
      metrics: [
        { label: "DEV TIME REDUCTION", value: "-80%", progress: 80 },
        { label: "PROTOCOL LATENCY", value: "0.85 ms", progress: 95 },
        { label: "TEST COVERAGE", value: "98.2%", progress: 98 },
      ],
      pipelineNodes: [
        { label: "● Agent.dispatch()", color: "#d64c1b" },
        { label: "● Siren.mcp_server()", active: true, color: "#d64c1b" },
        { label: "● Tool.execute()", color: "#10b981" },
        { label: "● CrewAI.sync_state()", color: "#8b5cf6" },
      ],
    },
    caseStudy: {
      headline: "Building Universal Communication Rails for Agentic AI",
      summary: "As AI products shift from single-prompt interactions to teams of specialized autonomous agents, inter-agent message passing and tool protocol compliance become the primary architectural bottleneck.",
      challenge: "Building a language-agnostic, low-latency communication layer that seamlessly bridges Python ML environments, TypeScript web services, and the emerging Model Context Protocol (MCP).",
      architecture: [
        "Engineered idiomatic TypeScript and Python client SDKs published to NPM and PyPI with automated GitHub Actions CI/CD.",
        "Built a high-performance Model Context Protocol (MCP) server enabling tools and resource querying for modern desktop and server agents.",
        "Implemented standardized integration wrappers for OpenAI Function Calling and CrewAI agent swarms.",
        "Designed state serialization protocols ensuring agent memory survives network reconnects and server restarts.",
      ],
      results: [
        "Cut internal engineering development time for agent features by ~80%.",
        "Achieved 160+ peak weekly downloads across package registries.",
        "Zero-overhead serialization benchmarked at under 1ms per message transfer.",
      ],
      stackDetails: [
        { technology: "TypeScript", purpose: "Client SDK for web, node, and edge environments" },
        { technology: "Python", purpose: "Async client for PyTorch and LangChain / CrewAI runtimes" },
        { technology: "MCP", purpose: "Model Context Protocol compliant tool and resource server" },
        { technology: "GitHub Actions", purpose: "Automated multi-environment matrix testing and release" },
      ],
    },
  },
  {
    id: "pencil-ai",
    categoryNumber: "03",
    category: "PLATFORM",
    title: "Pencil Ads",
    badge: "B2B",
    subtitle: "Event-driven creative automation and multi-tenant pipeline",
    description: "Refactored microservices and implemented event-driven processing during a platform overhaul. Built a metadata-driven multi-tenant schema and cut document export load times by 35% with server-side PDF rendering.",
    mediaType: "interactive",
    link: "https://github.com/kiransbaliga",
    role: "Full Stack Engineer",
    techStack: ["Node.js", "PostgreSQL", "Microservices", "Docker", "Redis"],
    architecture: {
      code: "PENCIL-CREATIVE-CORE",
      subhead: "B2B Ad Engine • Server-Side Rendering Cluster",
      status: "OPTIMAL",
      metrics: [
        { label: "PDF GENERATION SPEED", value: "+65%", progress: 65 },
        { label: "EXPORT LOAD TIME", value: "-35%", progress: 75 },
        { label: "THROUGHPUT", value: "14.2k req/s", progress: 88 },
      ],
      pipelineNodes: [
        { label: "● MultiTenant.schema()", color: "#d64c1b" },
        { label: "● CustomORM.resolve()", active: true, color: "#d64c1b" },
        { label: "● EventBus.publish()", color: "#10b981" },
        { label: "● SvgRenderer.to_pdf()", color: "#3b82f6" },
      ],
    },
    caseStudy: {
      headline: "Accelerating Multi-Tenant Ad Compilation by 65%",
      summary: "Pencil delivers AI-generated ad copy and visual layouts to thousands of enterprise brands. Every tenant requires customized metadata fields, strict data isolation, and high-fidelity vector rendering.",
      challenge: "Heavy client-side export pipelines were failing on complex multi-page ad books, and hardcoded database schemas made customer customizations prohibitively expensive to maintain.",
      architecture: [
        "Architected an event-driven microservices architecture using Node.js, RabbitMQ, and Redis to decouple ingestion from heavy rendering jobs.",
        "Implemented an extensible metadata-driven multi-tenant database layer that allows enterprises to define custom typed fields dynamically.",
        "Built a headless vector rendering pipeline on server workers, eliminating browser timeouts and boosting PDF export speed by 65%.",
      ],
      results: [
        "65% boost in PDF generation speed across all document exports.",
        "30–40% reduction in overall asset load times.",
        "Successfully supported enterprise clients with custom data dictionary requirements.",
      ],
      stackDetails: [
        { technology: "Node.js", purpose: "High-concurrency microservices and worker fleets" },
        { technology: "PostgreSQL", purpose: "Relational storage with JSONB metadata schemas" },
        { technology: "Redis", purpose: "Distributed caching and real-time job queues" },
        { technology: "Docker", purpose: "Sandboxed font and rendering containers" },
      ],
    },
  },
  {
    id: "poor-decisions",
    categoryNumber: "04",
    category: "SIDE PROJECT",
    title: "Poor Decisions",
    badge: "APP",
    subtitle: "5-second friction-free expense logging to Google Sheets",
    description: "An expense tracking iOS shortcut with Google Sheets integration — log expenses in 5 seconds straight into your spreadsheet with zero subscriptions, tracking, or dedicated apps required.",
    image: "/img/poor-decisions.png",
    mediaType: "interactive",
    link: "https://baliga.dev/poor-decisions/",
    role: "Creator & Developer",
    techStack: ["iOS Shortcuts", "Google Sheets API", "Automation", "REST"],
    architecture: {
      code: "POOR-DECISIONS-SYNC",
      subhead: "Zero-App Mobile Ingestion • Direct Cloud Sync",
      status: "SYNCED",
      metrics: [
        { label: "LOG TIME", value: "4.8s", progress: 95 },
        { label: "SUBSCRIPTION COST", value: "$0 / year", progress: 100 },
        { label: "DATA PRIVACY", value: "100% Local", progress: 100 },
      ],
      pipelineNodes: [
        { label: "● ActionButton.tap()", color: "#d64c1b" },
        { label: "● Siri.parse_input()", active: true, color: "#d64c1b" },
        { label: "● SheetsAPI.append()", color: "#10b981" },
        { label: "● Balance.recalculate()", color: "#f59e0b" },
      ],
    },
    caseStudy: {
      headline: "The Anti-Subscription Personal Finance Tracker",
      summary: "Most modern budgeting apps demand a $10/month subscription, harvest personal financial data, and take over 30 seconds of multi-step tapping to log a cup of coffee. Poor Decisions solves this with radical simplicity.",
      challenge: "Crafting a lightning-fast UX that runs instantly from the iOS Lock Screen or Action Button without maintaining a dedicated native Swift binary or cloud server.",
      architecture: [
        "Engineered an Apple Shortcut that executes from the iOS Lock Screen widget or Action Button in a single gesture.",
        "Integrated lightweight natural-language number parsing that splits voice or typed text into amount, description, and category.",
        "Dispatches securely authenticated REST requests directly to Google Sheets API v4 using tokenized Webhooks.",
      ],
      results: [
        "Reduced average expense logging time down to under 5 seconds.",
        "Over 1,000+ active users logging personal finances without subscriptions.",
        "100% user data privacy — zero telemetry leaves the user's personal Google account.",
      ],
      stackDetails: [
        { technology: "iOS Shortcuts", purpose: "Native lock screen and hardware action integration" },
        { technology: "Google Sheets API", purpose: "Free, customizable, permanent cloud ledger" },
        { technology: "Google Apps Script", purpose: "Automated monthly ledger rollups and budget warnings" },
      ],
    },
  },
  {
    id: "readfaster",
    categoryNumber: "05",
    category: "SIDE PROJECT",
    title: "ReadFaster",
    badge: "WEB",
    subtitle: "Rapid serial visual presentation speed reader",
    description: "An RSVP speed reader for faster, more focused reading on the web. Eliminates saccadic eye movement by streaming words sequentially at an anchor point up to 800+ WPM.",
    image: "/img/readfaster.png",
    mediaType: "interactive",
    link: "https://baliga.dev/readfaster/",
    role: "Creator & Developer",
    techStack: ["React", "TypeScript", "Vite", "Canvas API"],
    architecture: {
      code: "READFASTER-RSVP-CORE",
      subhead: "High-Frequency Token Streamer • 600 WPM Engine",
      status: "RUNNING",
      metrics: [
        { label: "MAX READING SPEED", value: "850 WPM", progress: 85 },
        { label: "FRAME JITTER", value: "< 0.4 ms", progress: 99 },
        { label: "AVERAGE TIME SAVED", value: "2.4x", progress: 75 },
      ],
      pipelineNodes: [
        { label: "● Text.tokenize()", color: "#d64c1b" },
        { label: "● Calculate.ORP()", active: true, color: "#d64c1b" },
        { label: "● rAF.tick()", color: "#10b981" },
        { label: "● Viewport.draw()", color: "#3b82f6" },
      ],
    },
    caseStudy: {
      headline: "Engineering Saccade-Free Reading with Microsecond Pacing",
      summary: "Human reading is primarily constrained by physical eye movements (saccades) as the retina scans across sentences. Rapid Serial Visual Presentation (RSVP) eliminates this bottleneck by displaying single words at a fixed fixation point.",
      challenge: "Preventing visual fatigue and maintaining high text comprehension at speeds upwards of 500 words per minute across varying word lengths and punctuation pauses.",
      architecture: [
        "Implemented the Optimal Recognition Point (ORP) formula to calculate the exact focal letter of each word and align it to a vertical red crosshair.",
        "Built a frame-accurate timer powered by `requestAnimationFrame` with dynamically scaled pauses for commas, periods, and long compound words.",
        "Designed a distraction-free digital canvas interface with customizable font sizes, dark mode, and keyboard shortcuts.",
      ],
      results: [
        "Allowed readers to comfortably consume long-form articles at 2x to 3x standard speeds.",
        "Zero dropped frames or animation jitter during high-cadence word cycling.",
      ],
      stackDetails: [
        { technology: "React 18", purpose: "Reactive UI state and keyboard controller" },
        { technology: "TypeScript", purpose: "Strict word tokenization and punctuation modeling" },
        { technology: "requestAnimationFrame", purpose: "Sub-millisecond frame-accurate pacing engine" },
      ],
    },
  },
  {
    id: "federated-learning",
    categoryNumber: "06",
    category: "RESEARCH",
    title: "Federated Learning",
    badge: "AI/ML",
    subtitle: "Privacy-preserving multi-task distributed training",
    description: "A multi-task federated learning system that enables collaborative model training across multiple distributed devices while strictly preserving data privacy through shared representations and local updates.",
    mediaType: "interactive",
    link: "https://github.com/kiransbaliga/Multi_Task_Federated_Learning",
    role: "AI Researcher",
    techStack: ["Python", "PyTorch", "Differential Privacy", "NumPy"],
    architecture: {
      code: "FED-LEARN-COORDINATOR",
      subhead: "Decentralized Model Aggregator • Differential Privacy",
      status: "CONVERGED",
      metrics: [
        { label: "CLIENT NODES", value: "128 Nodes", progress: 90 },
        { label: "PRIVACY GUARANTEE", value: "ε = 0.5 (DP)", progress: 95 },
        { label: "ACCURACY CONVERGENCE", value: "96.4%", progress: 96 },
      ],
      pipelineNodes: [
        { label: "● Client.train_local()", color: "#d64c1b" },
        { label: "● DiffPrivacy.clip_noise()", active: true, color: "#d64c1b" },
        { label: "● Encrypt.weight_diff()", color: "#10b981" },
        { label: "● FedAvg.global_merge()", color: "#6366f1" },
      ],
    },
    caseStudy: {
      headline: "Decentralized Machine Learning Without Centralized Data",
      summary: "Traditional ML pipelines demand pooling sensitive user data into monolithic cloud datacenters. Federated learning keeps data strictly on edge hardware, exchanging only encrypted gradient updates to train shared models.",
      challenge: "Mitigating statistical heterogeneity (non-IID data distributions) across clients while preventing model weight reconstruction attacks.",
      architecture: [
        "Formulated a multi-task objective that clusters client tasks by feature similarity, allowing specialized personal models to branch from a shared foundation.",
        "Integrated differential privacy (DP) gradient clipping and Gaussian noise injection to mathematically guarantee edge data anonymity.",
        "Simulated a network of 128 edge nodes with variable latency, packet loss, and compute constraints to evaluate real-world convergence.",
      ],
      results: [
        "Achieved 96.4% test accuracy while keeping raw datasets 100% on edge nodes.",
        "Maintained provable ε = 0.5 differential privacy guarantee against gradient inversion attacks.",
      ],
      stackDetails: [
        { technology: "Python 3", purpose: "Core simulation and network orchestration environment" },
        { technology: "PyTorch", purpose: "Neural network backpropagation and tensor transformations" },
        { technology: "Differential Privacy", purpose: "Noise injection and sensitivity bounds formulation" },
      ],
    },
  },
];

export const EXPERIENCE: ExperienceData[] = [
  {
    year: "Mar 2026 — Present",
    company: "Ultrahuman",
    position: "Backend Engineer",
    description: "Architected AI-powered health reporting and growth platforms serving 5M+ users. Built dynamic cross-product upsell systems achieving 8k+ conversions in two months. Contributing to Ultrahuman Ring and Performance Labs backend systems.",
    tags: ["Ruby on Rails", "PostgreSQL", "LLM", "AWS"],
  },
  {
    year: "Sep 2023 — Feb 2026",
    company: "KeyValue Software Systems",
    position: "Associate Software Engineer",
    description: "Built core communication modules for AI agent orchestration. Shipped JS & Python SDKs to NPM/PyPI, cutting AI feature dev time by ~80%. Architected scalable pipelines with Salesforce integration, improving API performance by 12%.",
    tags: ["Node.js", "Python", "TypeScript", "FastAPI", "MCP"],
  },
  {
    year: "May 2022 — Oct 2022",
    company: "TGH Tech",
    position: "Full Stack Engineer",
    description: "Built a full-stack mental-health platform with Django — content sharing, anonymous therapist messaging, and appointment scheduling. Deployed on AWS.",
    tags: ["Django", "Flutter", "MongoDB", "AWS"],
  },
  {
    year: "Jun 2021 — Dec 2021",
    company: "airPMO",
    position: "Flutter Developer",
    description: "Built key features for a construction SaaS platform streamlining operations across 10+ active projects. Improved collaboration and data sync by ~20%.",
    tags: ["Flutter", "Figma", "UI/UX"],
  },
];
