export type MediaType = "image" | "video" | "youtube";

type WithMedia =
  | { media: string; type: MediaType }
  | { media?: undefined; type?: undefined };

export type Experience = {
  year: string;
  title: string;
  position: string;
  description: string;
  tags: string[];
} & WithMedia;

export interface Showcase {
  media: string;
  type: "image" | "video";
  link?: string;
  description: string;
}

export const data: Experience[] = [
  {
    year: "Mar 2026 — Present",
    title: "Ultrahuman",
    position: "Backend Engineer (Ruby on Rails)",
    description: `**AI Health Reporting & Growth Platform**

* Architected and scaled **AI-powered health reporting and growth platforms serving 5M+ users**, delivering personalized reports and promotions through LLM workflows, experimentation frameworks, and automated quality-control systems.
* Reduced AI-localization translation failures by **~67%** with automated quality checks and error-recovery workflows.
* Built a dynamic cross-product upsell system driven by user behaviour and cohort processing, achieving **~8k+ conversions in two months**.

**Ultrahuman Ring & Performance Labs**

* Contributing to the backend systems powering the **Ultrahuman Ring** — continuous biometrics such as sleep, HRV, glucose trends, and recovery scores — and **Performance Labs**, Ultrahuman's advanced diagnostics and recovery facility in Bengaluru.`,
    tags: ["Ruby", "Rails", "LLM", "PostgreSQL"],
  },
  {
    year: "Sep 2023 — Feb 2026",
    title: "KeyValue Software Systems",
    position: "Associate Software Engineer",
    description: `**Pencil — B2B AI Ads Platform**

* Refactored microservices and implemented **event-driven processing** during a platform overhaul, building a custom **ORM** and utility library to improve scalability and reduce infrastructure cost.
* Built a **metadata-driven multi-tenant schema** letting tenants define configurable fields, types, and lookup values.
* Migrated document rendering to server-side infrastructure, cutting export load times by **30–40%** and improving **PDF generation speed by 65%**.

**Siren — Communication Rails for AI Agents**

* Built **core communication modules** enabling efficient multi-agent orchestration and workflows.
* Cut AI feature development time by **~80%** by shipping JavaScript & Python **SDKs**, an **MCP server**, and integrations for OpenAI and CrewAI — standardising AI development across teams.
* Published SDKs to **NPM and PyPI** (160+ peak downloads) with automated multi-environment **CI/CD**.

**Other Client Projects**

* Architected scalable pipelines integrating **Salesforce**, improving API performance by **12%** via backend caching and database optimisation.
* Built an **LLM-powered parsing pipeline** in **Python / FastAPI** to automate data extraction from unstructured content.
* Streamlined inventory and order processing with robust service architectures for e-commerce workflows.`,
    tags: ["Node.js", "Python", "FastAPI", "TypeScript", "PostgreSQL", "MCP"],
  },
  {
    year: "May 2022 — Oct 2022",
    title: "TGH Tech",
    position: "Full Stack Engineer",
    description: `**Mental Health Platform**

* Built a full-stack mental-health platform with **Django**, implementing content sharing, anonymous therapist messaging, and appointment-scheduling workflows.
* Deployed scalable backend services on **AWS**, ensuring reliable performance and secure user experiences.`,
    tags: ["Django", "Flutter", "MongoDB", "AWS"],
  },
  {
    year: "Jun 2021 — Dec 2021",
    title: "airPMO",
    position: "Flutter Developer (Part-time)",
    media: "https://www.youtube.com/embed/QMG86VMc_FU",
    type: "youtube",
    description: `**Construction SaaS Platform**

* Built key **Flutter** features for a construction SaaS platform that streamlined personnel, materials, equipment, and subcontractor operations.
* Improved project collaboration and data synchronisation by **~20%** by connecting stakeholders across **10+ active** construction and manufacturing projects.`,
    tags: ["Flutter", "Figma", "UI/UX"],
  },
  {
    year: "2020 — 2021",
    title: "IEEE CS SBC MACE",
    media:
      "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga.github.io/master/img/ieee.jpeg",
    type: "image",
    position: "Chairperson",
    description: `**Student Branch Chapter Lead**

* Led a team of **20+ members** to organise events, workshops, and hackathons, including **.hack()** — a 24-hour hackathon with **100+ participants** across the state.
* Grew the chapter into the **largest IEEE CS Branch in the world** that year.`,
    tags: ["Event Management", "Public Speaking", "Leadership"],
  },
];

export const about = {
  me: [
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/personal3.jpeg",
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/personal1.jpeg",
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/personal2.jpg",
  ],
  description: [
    "I'm Kiran — a backend engineer from Kerala. I build the systems that sit quietly underneath the products people use every day. At Ultrahuman that means AI-powered health platforms serving millions of users, where everything has to be fast, reliable, and invisible when it works.",

    "I'm drawn to problems at the seam of scale and craft — event-driven pipelines, multi-tenant data models, and the SDKs and agent tooling other engineers build on top of. To me, good engineering is less about clever code and more about systems that age well and quietly do their job.",

    "Away from the backend, I'm a perpetual generalist. I'll pick up a camera, a design tool, or a game engine depending on what an idea needs — and some of my favourite work started as an offhand conversation and ended as something shipped.",

    "I build to empower people, and I try to leave every codebase a little better than I found it.",
  ],
  pics: [
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/session1.JPG",
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/session2.jpg",
  ],
  volunteering: [
    {
      year: "2020-21",
      title: "IEEE CS SBC MACE",
      position: "Chairperson",
    },
    {
      year: "2021-22",
      title: "Tinker Hub MACE",
      position: "Technical Lead",
    },
    {
      year: "2021-23",
      title: "HACK CLUB MACE",
      position: "Coordinator",
    },
  ],
  images: [
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/team3.jpg",
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/team1.jpg",
    "https://github.com/kiransbaliga/kiransbaliga/raw/main/team2.jpg",
  ],
  contact: [
    {
      title: "Email",
      value: "kiransbaliga@gmail.com",
    },
    {
      title: "github",
      value: "https://github.com/kiransbaliga",
    },
    {
      title: "linkedin",
      value: "https://www.linkedin.com/in/kiransbaliga/",
    },
    {
      title: "twitter",
      value: "https://twitter.com/kiransbaliga",
    },
    {
      title: "instagram",
      value: "https://www.instagram.com/kiransbaliga/",
    },
    {
      title: "resume",
      value: "https://baliga.dev/resume",
    },
  ],
};

export const work: Showcase[] = [
  {
    media:
      "https://github.com/kiransbaliga/kiransbaliga.github.io/raw/master/img/Glome.png",
    type: "image",
    link: "https://tghtech.com",
    description:
      "Developed a comprehensive full-stack mental-health platform: content sharing, an anonymous chat room connecting users with expert therapists, and appointment scheduling. Built with Flutter on the frontend, Django on the backend, and MongoDB for data, deployed on AWS for reliable, scalable performance.",
  },
  {
    media:
      "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga.github.io/master/img/airpmo.png",
    type: "image",
    link: "https://airpmo.co/",
    description:
      "Worked on a SaaS product for the construction industry. airPMO connects the loosely related silos of a manufacturing project, tying every resource required for construction — people, material, equipment, and sub-contractors — into a single e-marketplace.",
  },
  {
    media:
      "https://github.com/kiransbaliga/kiransbaliga.github.io/raw/master/img/nhorah.jpg",
    type: "image",
    link: "https://www.linkedin.com/company/nhoarh/?originalSubdomain=in",
    description:
      "Contributed to development of a mobile application. Provided marketing solutions for offline retailers to better serve their customers.",
  },
];

export const projects: Showcase[] = [
  {
    media: "/img/poor-decisions.png",
    type: "image",
    link: "https://baliga.dev/poor-decisions/",
    description:
      "An expense tracking iOS shortcut with Google Sheets integration — log your expenses in 5 seconds straight into your Google Sheet with zero subscriptions or apps required.",
  },
  {
    media: "/img/readfaster.png",
    type: "image",
    link: "https://baliga.dev/readfaster/",
    description:
      "An RSVP speed reader for faster, more focused reading.",
  },
  {
    media:
      "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga.github.io/master/img/fl.png",
    type: "image",
    link: "https://github.com/kiransbaliga/Multi_Task_Federated_Learning",
    description:
      "A multi-task federated learning system that enables collaborative model training across multiple devices while preserving data privacy. It tackles diverse tasks simultaneously by leveraging shared representations and local training — enhancing efficiency without centralising data.",
  },
  {
    media:
      "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga.github.io/master/img/showcase.png",
    type: "image",
    link: "https://github.com/kiransbaliga/css-animations",
    description:
      "A showcase of curated CSS animations built in React from scratch.",
  },
  {
    media: "https://img.itch.zone/aW1nLzY4NTkzNTAucG5n/315x250%23c/vc540F.png",
    type: "image",
    link: "https://noobiedev.itch.io/trapped-in-chaos",
    description:
      "A platformer designed for Brackeys Game Jam 2021 — a blend of platforming challenges, puzzles, and engaging mechanics set against pixel-art visuals and an immersive soundtrack.",
  },
  {
    media:
      "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga.github.io/master/img/lost.png",
    type: "image",
    link: "https://github.com/kiransbaliga/lost",
    description:
      "A maze game for itch.io featuring complex maze-generation algorithms and an engaging puzzle adventure.",
  },
  {
    media:
      "https://github.com/kiransbaliga/kiransbaliga.github.io/raw/master/img/Typer.png",
    type: "image",
    link: "https://typer.kiransbaliga.engineer",
    description:
      "A 1v1 typing competition game where you can challenge your friends to a typing race.",
  },
  {
    media:
      "https://raw.githubusercontent.com/kiransbaliga/kiransbaliga.github.io/master/img/Where%20is%20my%20mouse.png",
    link: "https://kiransbaliga.github.io/Where-is-my-mouse",
    type: "image",
    description:
      "A fun plain HTML/CSS/JavaScript game where you have to find the mouse pointer in a sea of similar pointers.",
  },
];
