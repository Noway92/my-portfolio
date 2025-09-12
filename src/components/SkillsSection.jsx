"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Programming Languages
  { name: "Python", level: 90, category: "programming" },
  { name: "C#", level: 90, category: "programming" },
  { name: "Java", level: 70, category: "programming" },
  { name: "JavaScript", level: 70, category: "programming" },
  { name: "React", level: 70, category: "programming" },
  // Deep Learning / Data Science
  { name: "PyTorch", level: 60, category: "datascience" },
  { name: "TensorFlow", level: 80, category: "datascience" },
  { name: "Scikit-learn", level: 90, category: "datascience" },
  { name: "Pandas", level: 95, category: "datascience" },
  { name: "Hugging Face", level: 75, category: "datascience" },
  { name: "Kaggle", level: 70, category: "datascience" },
  // Data Visualisation
  { name: "Tableau", level: 85, category: "dataviz" },
  { name: "Matplotlib", level: 80, category: "dataviz" },
  { name: "Seaborn", level: 70, category: "dataviz" },
  // Databases
  { name: "SQL (MySQL)", level: 80, category: "databases" },
  { name: "SQL (Oracle)", level: 80, category: "databases" },
  { name: "MongoDB", level: 70, category: "databases" },
  { name: "Elasticsearch", level: 70, category: "databases" },
  // Tools & Methodologies
  { name: "Jira", level: 80, category: "tools" },
  { name: "GitLab/GitHub", level: 90, category: "tools" },
  { name: "CAMUNDA (BPMN)", level: 80, category: "tools" },
  { name: "Microsoft Office", level: 90, category: "tools" },
];

const categories = ["all", "programming", "datascience", "dataviz", "databases", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary">Skills</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-foreground hover:bg-secondary" // Typo corrigée
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="bg-card p-6 rounded-lg shadow-xs card-hover"
            >
              <div className="text-left mb-4">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full origin-left animate-[grow_1.5s_ease-out]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
