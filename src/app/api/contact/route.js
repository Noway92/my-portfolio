import nodemailer from "nodemailer";

export async function POST(request) {
  
  console.log("Chemin du projet :", process.cwd()); // Affiche le dossier courant
  console.log("GMAIL_USER :", process.env.GMAIL_USER); // Doit afficher ton email
  console.log("GMAIL_PASS :", process.env.GMAIL_PASS ? "**** (OK)" : "NON DÉFINI");


  // 1. Récupération et validation des données
  const { name, email, message } = await request.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(
      JSON.stringify({ error: "Tous les champs sont requis" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({ error: "Format d'email invalide" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Configuration du transporter (version optimisée pour Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,          // Port SSL
    secure: true,       // true pour le port 465
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS?.trim(), // Nettoie les espaces accidentels
    },
    tls: {
      // Désactive la vérification du certificat en développement seulement
      rejectUnauthorized: process.env.NODE_ENV !== "production",
    },
  });

  try {
    // 3. Vérification de la connexion SMTP avant l'envoi
    await transporter.verify();
    console.log("Connexion SMTP établie avec succès");

    // 4. Envoi de l'email
    await transporter.sendMail({
      from: `"${name}" <${process.env.GMAIL_USER}>`, // Utilise GMAIL_USER pour l'expéditeur
      replyTo: email,
      to: process.env.MAIL_RECEIVER,
      subject: `Nouveau message de ${name}`,
      text: `De : ${name} <${email}>\n\n${message}`,
      html: `<p><strong>De :</strong> ${name} (${email})</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Email envoyé avec succès" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erreur détaillée Nodemailer:", {
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    return new Response(
      JSON.stringify({
        error: "Échec de l'envoi de l'email",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
