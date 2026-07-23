# E-Vote — projets séparés

Le projet est désormais scindé en deux dossiers indépendants, chacun avec son propre HTML/CSS/JS et sa propre identité visuelle. Ils peuvent être déployés ensemble (même domaine, deux sous-dossiers) ou séparément (deux hébergements distincts, ex. électeur en public, admin sur un accès restreint).

```
E-vote-split/
├── electeur/              → formulaire d'inscription public
│   ├── index.html
│   ├── css/styles.css     → thème "bulletin officiel" (papier, laiton, tampon)
│   └── js/
│       ├── voter.js
│       └── firebase-config.js
│
├── admin/                 → console de gestion des électeurs
│   ├── index.html
│   ├── css/styles.css     → thème "console de contrôle" (graphite, mono, LED)
│   └── js/
│       ├── admin.js
│       └── firebase-config.js
│
└── firestore.rules        → règles partagées, à déployer sur le projet Firebase
```

## À faire avant mise en ligne

1. **Configuration Firebase** : renseigner les vraies valeurs dans **les deux** fichiers `js/firebase-config.js` (electeur ET admin) — ils sont indépendants, une modification dans l'un ne se répercute pas dans l'autre.
2. **Liens croisés** : `electeur/index.html` pointe vers `../admin/index.html` et vice-versa. Si vous hébergez les deux projets sur des domaines/URLs différents, mettez à jour ou retirez ces liens.
3. **Règles Firestore** : `firestore.rules` reste unique car les deux fronts parlent au même projet Firebase — à déployer une seule fois (`firebase deploy --only firestore:rules`).

## Design

- **Côté électeur** : ambiance cérémonielle — papier, sceau en laiton, billet à souche perforée qui se « tamponne » à l'inscription. Pensé pour rassurer un citoyen qui dépose une démarche officielle.
- **Côté admin** : ambiance opérationnelle — fond graphite, typographie monospace, indicateur de flux en direct, tableau façon journal de bord à lignes numérotées. Pensé pour un usage interne, dense et rapide à scanner.

Les deux partagent uniquement les polices Google Fonts (IBM Plex Sans / Mono) et la structure de données Firestore — aucun fichier CSS n'est mutualisé.
