# CoachLinkQ — liste d'attente des bénéficiaires

Prototype construit d'après la maquette du coach (page 1 = arrivée, page 2 = après inscription).

- `index.html` : la page d'arrivée (hero + formulaire, mission, comment ça marche, appel final, FAQ).
- `merci.html` : la page affichée après l'inscription, avec trois questions facultatives (format, budget par séance, frein).
- `confidentialite.html` : la politique de confidentialité. **Les passages surlignés en jaune sont à compléter** (responsable, contact, durée).
- `Code.gs` + `email-confirmation.html` : le script Google Apps Script qui écrit dans la Google Sheet et envoie l'email de bienvenue.
- `assets/` : le logo officiel « CoachLinkQ — Connecte-toi au bon coach » détouré, le C et le Q séparés pour l'écran de chargement, et les photos (hero et « comment ça marche » : Unsplash ; mission : fournie par le coach).

Aperçu local : `python3 -m http.server 4180` dans ce dossier, puis http://localhost:4180.

## Brancher la Google Sheet (10 minutes)

1. Crée une Google Sheet « CoachLinkQ — Liste d'attente » avec le compte Google qui doit envoyer les emails (idéalement celui du coach).
2. Dans la Sheet : **Extensions › Apps Script**. Remplace le contenu par `Code.gs`.
3. **+ › HTML**, nomme le fichier `email` (sans extension), colle `email-confirmation.html`.
4. **Déployer › Nouveau déploiement › Application Web**. Exécuter en tant que : *moi*. Accès : *Tout le monde*. Autorise les accès.
5. Copie l'URL qui finit par `/exec` dans `index.html` **et** dans `merci.html`, ligne `var ENDPOINT = "";`. Le bandeau jaune « Prototype » disparaît.
6. Dans `Code.gs`, renseigne `LOGO_URL` (ton domaine + `/assets/logo-coachlinkq.png`), puis redéploie.
7. Teste avec ton propre email : une ligne apparaît dans l'onglet « Liste d'attente », l'email arrive, puis les réponses facultatives remplissent la même ligne.

Colonnes : Date, Prénom, Email, Ville, Objectif, Format, Budget par séance, Frein, Source (`?utm_source=tiktok` dans le lien d'une pub = la source est enregistrée).

À chaque modification de `Code.gs` ou de l'email : **Gérer les déploiements › Modifier › Nouvelle version**.

## À régler avant la mise en ligne

- Le lien « Contact » du pied de page (`mailto:` vide) et les liens Instagram / TikTok / LinkedIn (`#`).
