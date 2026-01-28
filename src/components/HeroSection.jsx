"use client";

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  const handleScroll = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="container max-w-4xl mx-auto text-center z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="opacity-0 animate-fade-in">Hi, I'm</span>
            <span className="text-primary opacity-0 animate-fade-in-delay-1">
              {" "}
              Noé
            </span>
            <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">
              {" "}
              Le Yhuelic
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-3">
            My expertise spans the full AI pipeline, from understanding how models are built to effectively using them to create innovative, real-world solutions. I am particularly interested in leveraging state-of-the-art models through agent orchestration, MCP servers, and system-level integrations. I enjoy focusing on how these models can be combined, deployed, and adapted to solve concrete problems and build scalable, impactful products.
          </p>
          <div className="pt-4 opacity-0 animate-fade-in-delay-4">
            <button
              onClick={handleScroll}
              className="cosmic-button"
            >
              View My Work
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-muted-foreground mb-2">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};
