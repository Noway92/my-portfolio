import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css"; // Remplace ton ancien index.css
import { Inter } from "next/font/google"; // Exemple avec une police Google
import Script from "next/script";

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
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T442W8HT');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T442W8HT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Toaster /> {/* Place le Toaster ici pour qu'il soit global */}
        {children}  {/* Contenu dynamique des pages (Home, NotFound, etc.) */}
      </body>
    </html>
  );
}
