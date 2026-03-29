# GPS DRÔLE v4.0 — Prompt de continuation complet

## Identité
Application GPS humoristique PWA standalone. Un seul fichier HTML (4200+ lignes) contenant tout le CSS, JS et HTML. Personnages drôles qui donnent des directions de navigation avec humour, sarcasme ou insultes selon le mode choisi.

## Liens
- **Repo:** https://github.com/jcaron149-ux/gps-drole
- **Live:** https://jcaron149-ux.github.io/gps-drole/
- **Logo preview:** https://jcaron149-ux.github.io/gps-drole/logo-preview.html
- **Déploiement:** GitHub Pages auto (push master → live)
- **Branche:** master

## Stack technique (100% gratuit)
- **Carte:** Leaflet.js 1.9.4 + OpenStreetMap (tuiles sombres CartoDB dark_matter)
- **Routing:** OSRM (Open Source Routing Machine)
- **Geocoding:** Photon API (Komoot) avec biais local + Nominatim fallback
- **Voix:** Web Speech API (navigateur natif)
- **PWA:** Service Worker (sw.js v12) + manifest.json
- **Stockage:** localStorage (favoris, nom utilisateur, historique, route cache)
- **APIs navigateur:** Geolocation, Fullscreen, WakeLock, Vibration, Media Session

## Architecture fichiers
```
gps-drole/
├── index.html          (4200+ lignes — app monolithe complète)
├── sw.js               (97 lignes — Service Worker v12, network-first)
├── manifest.json       (20 lignes — config PWA)
├── logo-concept.svg    (logo SVG source)
├── logo-preview.html   (page preview du logo)
├── SKILL.md            (ce fichier)
└── .claude/launch.json (config dev server)
```

## 5 modes × 3 personas × 3 langues = 45 combinaisons

| Mode | Emoji | Persona 1 | Persona 2 | Persona 3 |
|------|-------|-----------|-----------|-----------|
| Grandmaman | 👵 | Janette (Janette Bertrand) | Betty (Betty White) | Katharine (Katharine Hepburn) |
| Enfant à bord | 👶 | Dory (Nemo) | Buzz (Buzz Lightyear) | Timon (Le Roi Lion) |
| Gang de chums | 🍕 | Deadpool (4e mur) | Seth (Seth Rogen) | Kronk (Emperor's New Groove) |
| Extrême drôle | 😂 | Morgan (Morgan Freeman) | Ron (Ron Burgundy) | Jarvis (Iron Man AI) |
| Extrême insulte | ☠️ | Gordon (Gordon Ramsay) | Ermey (Full Metal Jacket) | Thanos |

**Langues:** FR (québécois), EN, ES

## Fonctionnalités v4.0

### Navigation & carte
- GPS temps réel (watchPosition + badge vitesse km/h)
- Carte sombre CartoDB dark_matter
- Route OSRM avec étapes détaillées
- Turn-by-turn v2: 3 annonces/virage (500m, 200m, 30m) + noms de rues
- Recalcul auto hors route (ancienne route conservée pendant recalcul)
- ETA dynamique en temps réel
- Détection auto USA → MPH/feet
- Pré-chargement tuiles le long de la route
- Recherche Photon avec biais local
- Adresse de départ personnalisable

### Mode plein écran
- Fullscreen API au démarrage du guidage
- Bande d'instructions bleue en haut
- Boutons grossis pour conduite
- Vue 3D inclinée + flèche directionnelle

### Voix — Natural Speech Engine v2
- 6 techniques anti-synthétique: multi-utterance, variation dynamique, text hacking (ponctuation supprimée), intonation contour, emphase volume, respiration simulée
- Son ding 880Hz + vibration aux virages
- Répliques seulement lors des directives (pas tous les 200m)
- Texte des répliques NON affiché
- Sélection voix: Natural > Google > Legacy

### PWA & hors-ligne
- SW v12 network-first + cache-first tuiles
- Route en localStorage pour survie hors-ligne
- Avertissement vocal si recalcul échoue hors-ligne
- updateViaCache:'none' + reg.update() pour refresh immédiat
- WakeLock écran allumé pendant guidage

### Interface
- Thème par personnage (couleurs dynamiques)
- Transitions fluides + glassmorphism
- Bottom sheet style Google Maps
- Splash screen avec logo SVG crâne/sourire animé
- Confettis à l'arrivée
- Mode conduite simplifié + détection d'arrêt auto

### Personnalisation
- Nom utilisateur (demandé après disclaimer, sauvé en localStorage)
- Répliques personnalisées avec le prénom
- Favoris: Maison/Travail + liste personnalisée
- Historique trajets

### Logo
- Visage unique coupé au milieu: crâne anatomique (gauche) + visage jaune qui rit (droite)
- 2 yeux, 1 nez, 1 bouche partagés entre les deux moitiés
- Le Ô de DRÔLE = smiley jaune avec accent circonflexe
- Sous-titre: "À en mourir de rire"
- Pin GPS bleu au sommet

### Sécurité
- Disclaimer langage grossier à chaque visite
- Aucune donnée transmise (tout local)
- Conforme lois Canada/USA (mains libres)

## Scénarios de test (dans Paramètres ⚙️)
Tout droit, Droite, Gauche, Demi-tour, Virage raté, Recalcul, Trafic, Radar, Tunnel, Arrivée

## Règles de développement
1. Toujours push vers GitHub après modification
2. Bumper le SW (CACHE_NAME) à chaque changement
3. SVG inliné dans le HTML (pas de fichiers externes bloqués par SW)
4. Tester en mode incognito pour contourner le cache
5. Un seul fichier HTML — pas de framework
6. 100% gratuit — aucune API payante
7. Voix: nettoyer TOUTE ponctuation avant TTS, segments longs, variations subtiles

## Évolution future
- React Native + Mapbox (app store)
- ElevenLabs voix IA (payant)
- Capacitor pour APIs natives
- Android Auto / CarPlay
- Partage position temps réel
- Points d'intérêt, alertes vitesse
- Achievements / gamification
