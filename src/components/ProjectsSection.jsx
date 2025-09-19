"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Github,X, Download } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "TikTok generation video",
    description: "This project is generating tiktok's videos. Used HeyGen API for avatar creation, OPEN AI for the story generation and Python to compile avatar video, music, stock footage, and subtitles",
    image: "/projects/tiktok.jpg",
    tags: ["Python", "OPEN AI", "Rest API"],
    githubUrl: "https://github.com/Noway92/TikTok-Generation",
    modalContent: {
      fullDescription: "This project fully automates TikTok video creation through 4 key steps:\n\n1. Script generation via OpenAI (custom-engineered prompts for short, engaging narratives)\n2. Avatar creation using HeyGen API (100+ realistic avatar options)\n3. Automated editing in Python (FFmpeg/MoviePy) combining:\n   - Avatar video footage\n   - Royalty-free music (cleaned with AudioSegment)\n   - Satisfying stock clips\n   - Animated subtitles\n4. Optimization for 9:16 vertical format\n\nKey metrics:\n- 50+ videos auto-generated\n- Production time : 30 minutes\n- Cost : 20 cents/video",
      videoUrl: "/modale/video/output_video_Mike.mp4", 
    }
  },
  {
    id: 2,
    title: "Piano Music Generation",
    description: "This project aims to generate music using neural networks, specifically LSTM models, to predict note pitch and duration. Using this prediction, it is generating music from n notes.",
    image: "/projects/piano.jpg",
    tags: ["TensorFlow", "Pandas", "Matplotlib"],
    githubUrl: "https://github.com/Noway92/Piano-Generation",
    modalContent: {
      fullDescription: "This project aims to generate music using neural networks, specifically LSTM models, to predict note pitch and duration. MIDI files from the 'Dataset' folder serve as the dataset. \nThe process involves extracting musical information from MIDI files, creating a structured dataframe, and mapping pitches for model input. \nThree LSTM models are built and compared: one without embedding, one with embedding for notes concatenated with duration, and one predicting only notes using embedding with a fixed duration. \nTraining incorporates a custom batch generation function and manual early stopping and checkpointing. T\nhe trained models generate music sequences from a seed, saved as MIDI files and converted to WAV for playback. \nModels with two outputs are evaluated based on their validation loss and further compared to a model with one output. \nThe subjective quality of the generated music is assessed via audio playback. \nThe project demonstrates the use of LSTM networks for musical sequence generation, highlighting the importance of data pre-processing and model architecture. \n\nExplanation of the graph below : \n1. Embedding-based models outperformed raw input models in the long term, demonstrating the advantage of learned pitch representations for musical understanding.\n2. The embedding-only model (green line) achieved the lowest validation loss, showing that simplifying the output space (predicting only pitch) leads to better pitch modeling and more stable training.\n3. The dual-output embedding model (red line) improved steadily but was slightly constrained by the added task of predicting duration.\n4. The raw input model (blue line) showed faster early learning but plateaued earlier, suggesting a limited capacity to generalize musical structure without embeddings.\n\nLooking forward, this system provides a strong foundation for more advanced musical modeling, including genre adaptation, multi-instrument composition, or real-time human-in-the-loop improvisation systems. The modular architecture also opens doors to extensions with Transformer models and attention mechanisms.",
      audioUrl: "/modale/audio/Music-piano-2.wav", 
      additionalImages: [
        "/modale/image/LSTM_model_Two_output.png", // Courbe d'apprentissage
        "/modale/image/LSTM_model_One_output.png", // Courbe d'apprentissage
        "/modale/image/graphs_comparing_models.png"// Schéma du modèle LSTM

      ]
    }
  },
  {
    id: 3,
    title: "AI algorithms",
    description: "This repository contains four projects I developed during my 4th year at ESILV, as part of my specialization in Data and Artificial Intelligence. You will find: Search Algorithms, Genetic Algorithms...",
    image: "/projects/ai-algorithms.jpg",
    tags: ["Scikit-learn", "Pandas", "Numpy"],
    githubUrl: "https://github.com/Noway92/Ai-Algorithms",
    modalContent: {
      fullDescription: "This repository contains four projects I developed during my 4th year at ESILV, as part of my specialization in Data and Artificial Intelligence. \n\nThe repository includes four Jupyter notebooks: \n\n- Search Algorithms: Implementation of informed and uninformed search strategies (Uniform Cost Search, A* Algorithm, and Breadth-First Search) to find the shortest solution path for the 8-Puzzle Problem.\n- Genetic Algorithm: Optimization of a Neural Network using evolutionary techniques.\n- Reinforcement Learning: Training an agent to complete the FrozenLake-v1 environment using reinforcement learning methods.\n- Constraint Satisfaction Problem (CSP): Solving the Battleship Solitaire Puzzle with constraint programming techniques.",
      additionalImages: [
        "/modale/image/Genetic_Algorithm.png",  
        "/modale/image/Reinforcement_learning.png"  
      ]
    }
  }
];


export const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>
        <div className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          <div>Here are some of my projects!</div>
          <div>Each of these projects was crafted with passion, creativity, and attention to detail. </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
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

      {/* Modale */}
      {selectedProject && (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/20">
          {/* Header de la modale */}
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Fermer la modale"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenu de la modale */}
          <div className="p-6">
            {/* Image principale */}
            <div className="mb-6 rounded-lg overflow-hidden">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover"
                priority
              />
            </div>

            {/* Description complète */}
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-line">{selectedProject.modalContent.fullDescription}</p>
            </div>

            {/* Bloc multimédia (vidéo OU audio) */}
            <div className="mb-6">
              {selectedProject?.modalContent?.videoUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <video
                        controls
                        src={selectedProject.modalContent.videoUrl}
                        className="w-full h-full"
                        onError={(e) => console.error("Erreur vidéo", e)}
                      >
                        <p>
                          Video not available. Click below to download the video.
                        </p>
                      </video>
                    </div>
                  </div>
                ) :  selectedProject?.modalContent?.audioUrl ? (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <audio
                    controls
                    src={selectedProject.modalContent.audioUrl}
                    className="w-full"
                    onError={(e) => console.error("Erreur audio", e)}
                  >
                    <p>
                      Audio not avaible. Click below to download the audio.
                    </p>
                  </audio>
                </div>
              ) : (
                <div className="bg-secondary/20 p-4 rounded-lg text-center text-sm">
                  Media not avaible
                </div>
              )}
            </div>


            {/* Images supplémentaires */}
            {selectedProject.modalContent.additionalImages?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Gallery</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.modalContent.additionalImages.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Détail ${index + 1} - ${selectedProject.title}`}
                        width={500}
                        height={300}
                        //className="w-full h-48 object-cover transition-transform hover:scale-[1.02]"
                        className="w-full h-48 object-contain bg-black transition-transform hover:scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags et lien GitHub */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 cosmic-button flex items-center justify-center gap-2"
                >
                  <Github size={16} />
                  Source Code
                </a>
              )}

              {selectedProject.modalContent.audioUrl && (
                <a
                  href={selectedProject.modalContent.audioUrl}
                  download
                  className="flex-1 border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Audio
                </a>
              )}

              {selectedProject.modalContent.videoUrl && (
                <a
                  href={selectedProject.modalContent.videoUrl}
                  download
                  className="flex-1 border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Video
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </section>
  );
};
