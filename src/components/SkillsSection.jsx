"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Programming Languages
  { name: "Python", category: "programming" },
  { name: "C#", category: "programming" },
  { name: "Java", category: "programming" },
  { name: "JavaScript", category: "programming" },
  { name: "TypeScript", category: "programming" },
  { name: "React", category: "programming" },
  // Deep Learning / Data Science
  { name: "TensorFlow", category: "datascience" },
  { name: "PyTorch", category: "datascience" },
  { name: "Scikit-learn", category: "datascience" },
  { name: "Pandas", category: "datascience" },
  { name: "Numpy", category: "datascience" },
  { name: "Hugging Face", category: "datascience" },
  { name: "Kaggle", category: "datascience" },
  // Data Visualisation
  { name: "Tableau", category: "dataviz" },
  { name: "PowerBI", category: "dataviz" },
  { name: "Matplotlib", category: "dataviz" },
  { name: "Seaborn", category: "dataviz" },
  // Databases
  { name: "MySQL", category: "databases" },
  { name: "Oracle", category: "databases" },
  { name: "MongoDB", category: "databases" },
  { name: "Elasticsearch", category: "databases" },
  { name: "Cassandra", category: "databases" },
  { name: "Neo4j", category: "databases" },
  // Tools & Methodologies
  { name: "Jira", category: "tools" },
  { name: "GitLab/GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "CAMUNDA (BPMN)", category: "tools" },
  { name: "Microsoft Office", category: "tools" },
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
        <div className="p-6">
          <div className="flex flex-wrap gap-2 s-4">
            {filteredSkills.map((skill) => (
              <span
                key={skill.name}
                className="px-4 py-2 text-base font-semibold border rounded-full bg-secondary text-secondary-foreground"
              >
                {skill.name}
              </span>

            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
