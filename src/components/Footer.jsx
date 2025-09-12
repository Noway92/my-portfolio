"use client";

import { ArrowUp } from "lucide-react";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-4 bg-card border-t border-border mt-12 flex items-center">
      <p className="flex-1 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} NoeLeYhuelic.co All rights reserved.
      </p>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};
