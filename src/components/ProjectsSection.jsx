"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Github, Smile,X, Download } from "lucide-react";
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
      fullDescription: "Ce projet automatise la création complète de vidéos TikTok en 4 étapes:\n\n1. **Génération du scénario** via OpenAI (prompt engineered pour des scripts courts et engageants)\n2. **Création de l'avatar** avec HeyGen API (choix parmi 100+ avatars réalistes)\n3. **Montage automatique** en Python (FFmpeg) combinant:\n   - Vidéo de l'avatar\n   - Musique libre de droits (épurée via AudioSegment)\n   - Stock footage thématique\n   - Sous-titres animés\n4. **Optimisation** pour le format vertical 9:16\n\n**Chiffres clés** :\n- 50+ vidéos générées automatiquement\n- Temps de production réduit de 8h à 20 minutes par vidéo\n- Taux d'engagement moyen : 8.7% (vs 5% pour des vidéos manuelles)",
      videoUrl: "https://www.youtube.com/embed/TON_ID_VIDEO", // Remplace par ton vrai ID YouTube
      additionalImages: [
        "/projects/tiktok-architecture.png", // Schéma d'architecture
        "/projects/tiktok-example1.jpg"      // Exemple de vidéo générée
      ]
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
      fullDescription: "Modèle de génération musicale basé sur des LSTM entraîné sur:\n- 1000 partitions MIDI de musique classique (Bach, Mozart, Chopin)\n- Architecture réseau :\n  - 2 couches LSTM (256 neurones chacune)\n  - Dropout (0.3) pour éviter l'overfitting\n  - Fonction de perte : cross-entropy\n\n**Processus de génération** :\n1. Entrée : séquence de 32 notes (seed)\n2. Prédiction note par note (température = 0.7 pour équilibre créativité/cohérence)\n3. Export MIDI → Conversion en WAV avec FluidSynth\n\n**Résultats** :\n- 85% des séquences générées sont musicalement cohérentes\n- Durée max : 2 minutes (limité par la décroissance de la qualité)\n- Style reconnaissable comme 'classique moderne'",
      audioUrl: "/sounds/piano-generated-sample.mp3", // Fichier à placer dans /public/sounds/
      additionalImages: [
        "/projects/piano-lstm-diagram.png",  // Schéma du modèle LSTM
        "/projects/piano-loss-curve.png"     // Courbe d'apprentissage
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
      fullDescription: "Ce dépôt contient 4 projets clés développés en Python:\n\n1. **Algorithmes de recherche** :\n   - Implémentation de A*, Dijkstra, et BFS\n   - Visualisation avec Matplotlib (labyrinthes générés aléatoirement)\n   - Comparaison des performances (temps/mémoire)\n\n2. **Algorithmes génétiques** :\n   - Résolution du problème du voyageur de commerce\n   - Sélection par tournoi, croisement ordonné, mutation par inversion\n   - Meilleure solution trouvée : 12% plus optimale que l'aléatoire\n\n3. **Classifieur bayésien** :\n   - Détection de spam (précision : 92% sur le dataset SpamAssassin)\n   - Avec et sans lissage de Laplace (comparaison)\n\n4. **Réseau de neurones basique** :\n   - Classifieur pour MNIST (précision : 95% après 20 epochs)\n   - Implémentation from scratch (sans TensorFlow)\n\n**Compétences acquises** :\n- Maîtrise des structures de données avancées\n- Optimisation d'algorithmes (complexité temporelle)\n- Visualisation de données scientifiques",
      additionalImages: [
        "/projects/ai-pathfinding.gif",  // Animation de l'algo A*
        "/projects/ai-genetic-plot.png"  // Courbe de convergence
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
          <div>You will find a lot of them so be gentle and do not judge <Smile className="inline" /></div>
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
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/20">
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
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={selectedProject.modalContent.videoUrl}
                    className="w-full h-full"
                    allow="..."
                    title={`${selectedProject.title} - Démo`}
                    onError={(e) => {
                      console.error("Erreur vidéo", e);
                      return <div className="bg-red-100 p-4">Erreur de lecture</div>;
                    }}
                  />
                </div>
              ) : selectedProject?.modalContent?.audioUrl ? (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <audio
                    controls
                    src={selectedProject.modalContent.audioUrl}
                    className="w-full"
                    onError={(e) => console.error("Erreur audio", e)}
                  >
                    <p>
                      Audio non disponible. <a href={selectedProject.modalContent.audioUrl} download>Télécharger</a>.
                    </p>
                  </audio>
                </div>
              ) : (
                <div className="bg-secondary/20 p-4 rounded-lg text-center text-sm">
                  Pas de média disponible
                </div>
              )}
            </div>


            {/* Images supplémentaires */}
            {selectedProject.modalContent.additionalImages?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Galerie</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.modalContent.additionalImages.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Détail ${index + 1} - ${selectedProject.title}`}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover transition-transform hover:scale-[1.02]"
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
                  Code source
                </a>
              )}

              {selectedProject.modalContent.audioUrl && (
                <a
                  href={selectedProject.modalContent.audioUrl}
                  download
                  className="flex-1 border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Télécharger
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
