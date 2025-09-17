"use client"; // <-- Ajoute cette directive en haut du fichier !

import {
  Mail,
  MapPin,
  Phone,
  Send,
  Linkedin,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = {
      name: form.elements.namedItem("name").value,
      email: form.elements.namedItem("email").value,
      message: form.elements.namedItem("message").value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur réseau");

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again later.",
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-primary">Touch</span>
        </h2>
        <div className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          <div>Have a project in mind or looking for a new data scientist?</div>
          <div>Feel free to send me a message!</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">

              {/* Email */}
              <a
                href="mailto:noe.le_yhuelic@edu.devinci.fr"
                className="flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary">Email</h4>
                  <p className="text-muted-foreground group-hover:text-primary">
                    noe.le_yhuelic@edu.devinci.fr
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+33769624396"
                className="flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary">Phone</h4>
                  <p className="text-muted-foreground group-hover:text-primary">
                    +33 7 69 62 43 96
                  </p>
                </div>
              </a>

              {/* Location*/}
              <a
                href="https://www.google.com/maps/place/Paris,+France"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary">Location</h4>
                  <p className="text-muted-foreground group-hover:text-primary">Paris, France</p>
                </div>
              
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/no%C3%A9-le-yhuelic/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary">LinkedIn</h4>
                  <p className="text-muted-foreground group-hover:text-primary">Noé Le Yhuelic</p>
                </div>
              </a>

              {/* CV Download */}
              <a
                href="/documents/NoeLeYhuelicCVanglais.pdf"
                download
                className="flex items-start space-x-4 group"
              >
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary">CV</h4>
                  <p className="text-muted-foreground group-hover:text-primary">Download my CV</p>
                </div>
              </a>

            </div>
          </div>


          {/* Formulaire */}
          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" // Typo corrigée
                  placeholder="Noé Le Yhuelic..."
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" // Typo corrigée
                  placeholder="noe.le_yhuelic@edu.devinci.fr"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" // Typo corrigée
                  placeholder="Hello, I'd like to talk about..."
                />
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-2 cosmic-button",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
