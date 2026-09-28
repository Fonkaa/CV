export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  mediaType?: "image" | "video";
  mediaUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface SkillCategory {
  category: string;
  list: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  telegram: string;
  instagram: string;
  linkedin?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export type ThemeType = "obsidian-gold" | "emerald-rose" | "sapphire-ice" | "minimal-alabaster";

export interface PortfolioData {
  adminPasscode: string;
  theme: ThemeType;

  // 1. Navigation Bar Copy
  navbar: {
    brandMonogram: string;
    brandTitle: string;
    navOverview: string;
    navProjects: string;
    navSkills: string;
    navContact: string;
  };

  // 2. Hero Section Copy
  hero: {
    name: string;
    badge: string;
    status: string;
    headline: string;
    subheadline: string;
    bio: string;
    avatarUrl: string;
    resumeUrl: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };

  // 3. Projects Section Copy
  projectsCopy: {
    badge: string;
    heading: string;
    subheading: string;
  };
  projects: Project[];

  // 4. Skills Section Copy
  skillsCopy: {
    badge: string;
    heading: string;
    subheading: string;
  };
  skills: SkillCategory[];

  // 5. GitHub Telemetry Copy
  githubCopy: {
    badge: string;
    heading: string;
    placeholder: string;
    buttonText: string;
  };
  githubUsername: string;

  // 6. Contact & Direct Transmission Copy
  contactCopy: {
    badge: string;
    heading: string;
    subheading: string;
    formTitle: string;
    formSubtitle: string;
    buttonText: string;
    successMessage: string;
    footerCopyright: string;
    footerStatus: string;
  };
  contact: ContactInfo;

  // 7. AI Assistant Copy & Directives
  aiCopy: {
    title: string;
    subtitle: string;
    greeting: string;
    inputPlaceholder: string;
  };
  aiInstructions: string;

  // 8. Deep Document Grounding (Ingested PDF Resume / CV / Portfolio Bio)
  resumePdfName?: string;
  resumePdfText?: string;

  // 9. Messages Inbox
  messages?: ContactMessage[];
}