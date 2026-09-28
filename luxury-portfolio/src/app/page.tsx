"use client";

import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubProjects from "@/components/GitHubProjects";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="relative z-10 flex flex-col gap-12">
      <Hero />
      <ProjectsSection />
      <GitHubProjects />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}