"use client";

import { ArrowRight, ExternalLink, Github, Smile } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "TikTok generation video",
    description: "This project is generating tiktok's videos. Used HeyGen API for avatar creation, OPEN AI for the story generation and Python to compile avatar video, music, stock footage, and subtitles",
    image: "/projects/tiktok.jpg",
    tags: ["Python", "OPEN AI", "Rest API"],
    githubUrl: "https://github.com/Noway92/TikTok-Generation",
  },
  {
    id: 2,
    title: "Piano Music Generation",
    description: "This project aims to generate music using neural networks, specifically LSTM models, to predict note pitch and duration. Using this prediction, it is generating music from n notes.",
    image: "/projects/piano.jpg",
    tags: ["TensorFlow", "Pandas", "Matplotlib"],
    githubUrl: "#",
  },
  {
    id: 3,
    title: "AI algorithms",
    description: "This repository contains four projects I developed during my 4th year at ESILV, as part of my specialization in Data and Artificial Intelligence. You will find: Search Algorithms, Genetic Algorithms...",
    image: "/projects/ai-algorithms.jpg", // Chemin corrigé
    tags: ["Scikit-learn", "Pandas", "Numpy"],
    githubUrl: "https://github.com/Noway92/Ai-Algorithms",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>
        <div className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          <div>Here are some of my projects!</div>
          <div>You will find a lot of them so be gentle and do not judge <Smile className="inline" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    {project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/80 hover:text-primary transition-colors duration-300"
                      >
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Noway92"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
