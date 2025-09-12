import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="mb-8">La page que vous cherchez n'existe pas.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
