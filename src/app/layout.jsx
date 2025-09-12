import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css"; // Remplace ton ancien index.css
import { Inter } from "next/font/google"; // Exemple avec une police Google

// Configuration d'une police (optionnel)
const inter = Inter({ subsets: ["latin"] });

// Métadonnées pour le SEO
export const metadata = {
  title: "Mon Portfolio",
  description: "Portfolio de Noé Le Yhuelic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.className}>
      <body>
        <Toaster /> {/* Place le Toaster ici pour qu'il soit global */}
        {children}  {/* Contenu dynamique des pages (Home, NotFound, etc.) */}
      </body>
    </html>
  );
}
