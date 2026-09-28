import { PortfolioData } from "@/types/portfolio";

export const initialData: PortfolioData = {
  adminPasscode: "fiker4620",
  theme: "obsidian-gold",

  navbar: {
    brandMonogram: "✦",
    brandTitle: "Portfolio",
    navOverview: "Overview",
    navProjects: "Selected Works",
    navSkills: "Expertise",
    navContact: "Connect",
  },

  hero: {
    name: "Abdulbasit Ylkal Abate",
    badge: "Available for High-Impact Roles",
    status: "Active & Available",
    headline: "Architecting Resilient Software & Scalable AI Systems",
    subheadline: "Full-Stack Software Engineer & Distributed Systems Developer",
    bio: "Specializing in high-throughput backend services, modern reactive web interfaces, database optimization, and automated machine learning scoring microservices.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    resumeUrl: "#",
    ctaPrimaryText: "Explore Architectural Works",
    ctaSecondaryText: "Initiate Consultation",
  },

  projectsCopy: {
    badge: "Selected Portfolio Works",
    heading: "Engineered Deployments & Systems",
    subheading: "A curated index of production architectures, AI pipelines, and distributed platforms.",
  },
  projects: [
    {
      id: "smart-internship",
      title: "Smart Internship & Job Matching System",
      tagline: "AI Matching & Multi-Role Pipeline",
      description: "FastAPI and Express microservice architecture with automated scoring algorithms, normalized database schema, and role-based matching workflows.",
      tags: ["FastAPI", "Express.js", "PostgreSQL", "Next.js"],
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      liveUrl: "https://",
      githubUrl: "https://github.com/Fonkaa",
      featured: true,
    },
    {
      id: "homerentalpro",
      title: "HomeRentalPro",
      tagline: "Full-Stack Property Management",
      description: "Robust property management endpoints, automated database migration scripts, transaction management, and rental verification pipelines.",
      tags: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      liveUrl: "https://",
      githubUrl: "https://github.com/Fonkaa",
      featured: true,
    }
  ],

  skillsCopy: {
    badge: "Core Technical Disciplines",
    heading: "Architectural Disciplines & Stack",
    subheading: "Battle-tested competencies across backend systems, web interfaces, and automated infrastructure.",
  },
  skills: [
    {
      category: "Backend & Systems",
      list: ["FastAPI", "Express.js", "Node.js", "Python", "REST APIs", "Concurrency Management"],
    },
    {
      category: "Databases & Storage",
      list: ["PostgreSQL", "Database Migrations", "Schema Normalization", "Query Optimization", "Redis"],
    },
    {
      category: "Frontend & Reactive Architecture",
      list: ["Next.js", "TypeScript", "React", "Tailwind CSS", "State Management"],
    },
    {
      category: "DevOps & Tooling",
      list: ["Docker", "Git/GitHub", "Linux Systems", "CI/CD Workflows"],
    },
  ],

  githubCopy: {
    badge: "Live GitHub Telemetry",
    heading: "Open Source & Public Repositories",
    placeholder: "GitHub handle (e.g. Fonkaa)...",
    buttonText: "Sync Repos",
  },
  githubUsername: "Fonkaa",

  contactCopy: {
    badge: "Direct Communication Hub",
    heading: "Initiate Contact & Engineering Inquiries",
    subheading: "Send an instant transmission directly to my primary dispatch inbox, or reach out through direct communication channels.",
    formTitle: "Send Direct Transmission",
    formSubtitle: "Dispatches directly to verified email & Admin Codex",
    buttonText: "Dispatch Message",
    successMessage: "Transmission received. Dispatched directly to the primary email and inscribed into the Admin Codex.",
    footerCopyright: "© 2026 Portfolio Atelier. All dynamic systems connected.",
    footerStatus: "High Availability Online",
  },
  contact: {
    email: "fikiylkal@gmail.com",
    phone: "+251 900 000 000",
    telegram: "@Fonkaa",
    instagram: "Fonkaa",
  },

  aiCopy: {
    title: "Digital Twin AI",
    subtitle: "Online • Grounded in system data",
    greeting: "Greetings. I am the digital twin and portfolio system guide. Ask me anything regarding projects, technical competencies, or contact information.",
    inputPlaceholder: "Ask about architecture, stack, or experience...",
  },
  aiInstructions: "Represent the candidate with executive precision, authoritative system design knowledge, and strict adherence to verified portfolio data.",
  messages: [],
};