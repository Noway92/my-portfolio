# Mon Portfolio

Portfolio personnel développé avec Next.js 15, React 19 et TailwindCSS 4.

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🛠️ Technologies

- **Next.js 15** - Framework React
- **React 19** - Interface utilisateur
- **TailwindCSS 4** - Styles
- **Lucide React** - Icônes
- **Nodemailer** - Formulaire de contact

## 🧗 Fond animé

`src/components/ClimbingBackground.jsx` dessine en fond (canvas) un paysage de montagne : ciel (jour / nuit étoilée selon le thème),
chaînes enneigées en parallaxe, nuages et oiseaux, encadrés par deux falaises de roche. Un grimpeur à droite et une
grimpeuse (queue de cheval animée) à gauche montent chacun leur voie à l'infini
(mouvements main/pied avec IK, et de temps en temps un « dyno » : saut pour attraper une prise plus haute).
Sous 768 px de large, seuls le ciel et les montagnes sont affichés.
Quand on scrolle vers le haut, les grimpeurs chutent : ils sont retenus par la corde sur la dernière dégaine mousquetonnée,
rebondissent, se balancent puis reprennent les prises et repartent.
Les grimpeurs (tenue, côté, rythme) se configurent dans le tableau `CLIMBERS` en haut du fichier.
Le grimpeur accélère quand on scrolle, suit le thème clair/sombre et reste figé si `prefers-reduced-motion` est activé.
Pour le retirer, supprimer `<ClimbingBackground />` dans `src/app/page.jsx`.

## 📦 Scripts

- `npm run dev` - Lancer en mode développement
- `npm run build` - Build de production
- `npm start` - Lancer le serveur de production
