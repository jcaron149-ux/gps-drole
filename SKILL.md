# GPS DRÔLE v4.2 — Prompt de continuation complet

## Identité
Application GPS humoristique PWA standalone. Un seul fichier HTML (4300+ lignes) contenant tout le CSS, JS et HTML. Personnages drôles qui donnent des directions de navigation avec humour, sarcasme ou insultes selon le mode choisi.

## Liens
- **Repo:** https://github.com/jcaron149-ux/gps-drole
- **Live:** https://jcaron149-ux.github.io/gps-drole/
- **Logo preview:** https://jcaron149-ux.github.io/gps-drole/logo-preview.html
- **Déploiement:** GitHub Pages auto (push master → live)
- **Branche:** master

## Stack technique (100% gratuit)
- **Carte:** Leaflet.js 1.9.4 + OpenStreetMap (tuiles sombres CartoDB dark_matter)
- **Routing:** OSRM (Open Source Routing Machine)
- **Geocoding:** Nominatim (prioritaire pour adresses avec numéro civique) + Photon API (Komoot, pour noms de lieux)
- **Voix:** Web Speech API (navigateur natif)
- **PWA:** Service Worker (sw.js v12) + manifest.json
- **Stockage:** localStorage (favoris, nom utilisateur, historique, route cache)
- **APIs navigateur:** Geolocation, Fullscreen, WakeLock, Vibration, Media Session

## Architecture fichiers
```
gps-drole/
├── index.html          (4300+ lignes — app monolithe complète)
├── sw.js               (97 lignes — Service Worker v12, network-first)
├── manifest.json       (20 lignes — config PWA)
├── logo-concept.svg    (logo SVG — visage crâne/sourire)
├── logo-preview.html   (page preview du logo)
├── SKILL.md            (ce fichier — prompt de continuation)
└── .claude/launch.json (config dev server preview)
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

## Fonctionnalités v4.2

### Navigation & carte
- GPS temps réel (watchPosition + badge vitesse km/h)
- Carte sombre CartoDB dark_matter
- Route OSRM avec étapes détaillées
- Turn-by-turn v2: 3 annonces/virage (500m, 200m, 30m) + noms de rues
- Recalcul auto hors route (ancienne route conservée pendant recalcul)
- ETA dynamique en temps réel
- Détection auto USA → MPH/feet
- Pré-chargement tuiles le long de la route
- Adresse de départ personnalisable
- **Numéros civiques** pris en charge (Nominatim avec viewbox local quand numéro détecté)
- **Calcul automatique** de la route quand on sélectionne une destination (pas de bouton CALCULER)
- Coordonnées cachées de l'autocomplétion réutilisées (évite double geocoding)
- mousedown/touchstart sur les items autocomplétion (évite race condition avec blur)

### Mode plein écran
- Fullscreen API au démarrage du guidage
- Bande d'instructions bleue en haut
- Boutons grossis pour conduite
- Vue 3D inclinée + flèche directionnelle

### Mode Conduite (HUD)
- Interface ultra-simplifiée: vitesse en gros, flèche directionnelle, distance au virage, ETA
- Tout le reste masqué pour zéro distraction
- Bouton QUITTER pour revenir au mode normal
- Mise à jour toutes les 2 secondes

### Voix — Natural Speech Engine v2
- 6 techniques anti-synthétique:
  1. Multi-utterance: segments longs (max 80 car, max 3 segments)
  2. Variation dynamique: rate ±5%, pitch ±4% par segment
  3. Text hacking: TOUTE ponctuation supprimée (. , - : ; " etc.) — seuls lettres/chiffres/apostrophes restent
  4. Intonation contour: pitch monte pour questions (+8%), descend en fin (-5%)
  5. Emphase par volume: mots CAPS plus forts
  6. Respiration simulée: pauses variables entre segments
- Son ding 880Hz + vibration aux virages
- Répliques seulement lors des directives (pas tous les 200m)
- Texte des répliques NON affiché à l'écran
- Sélection voix: Natural > Google > Legacy
- **Slider vitesse voix** dans Paramètres > Synthèse vocale (0.6x à 1.5x)

### PWA & hors-ligne
- SW v12 network-first pour app + cache-first pour tuiles carte
- Route sauvegardée en localStorage pour survie hors-ligne
- Pré-chargement tuiles le long de la route (tant qu'on a du réseau)
- Avertissement vocal du personnage si recalcul échoue hors-ligne
- updateViaCache:'none' + reg.update() pour mises à jour immédiates
- WakeLock: écran allumé pendant guidage

### Interface
- **Bottom sheet** style Google Maps — ouvert par défaut à 50vh au lancement
- Thème par personnage (couleurs dynamiques)
- Transitions fluides + glassmorphism (backdrop-filter blur)
- Splash screen avec logo SVG crâne/sourire animé
- Confettis à l'arrivée
- Bouton "Effacer" petit et discret (remplace l'ancien CALCULER)
- Icône ⚙️ Paramètres pour accéder aux réglages et tests

### Personnalisation
- Nom utilisateur (demandé au premier lancement après disclaimer, sauvé en localStorage)
- Répliques personnalisées avec le prénom de l'utilisateur
- Changement de nom dans Paramètres > Profil
- Favoris: Maison/Travail raccourcis + liste personnalisée
- **Historique trajets** avec auto-suppression après 7 jours d'inactivité
- Bouton "Relancer" sur chaque trajet de l'historique

### Logo
- Visage unique coupé au milieu: crâne anatomique (gauche) + visage jaune qui rit (droite)
- Oeil gauche: orbite noire avec pupille rouge
- Oeil droit: oeil plissé qui rit avec larme bleue
- Bouche: dents de crâne réalistes à gauche, gros sourire à droite
- Le Ô de DRÔLE = smiley jaune avec accent circonflexe
- Sous-titre: "À en mourir de rire"
- Pin GPS bleu au sommet
- Glow rouge (crâne) / orange (rire) autour

### Sécurité & légal
- Disclaimer langage grossier à CHAQUE visite (pas de skip)
- Bouton "J'ACCEPTE ET JE CONTINUE" obligatoire
- Aucune donnée transmise à un serveur (tout en localStorage)
- Conforme lois Canada/USA (mains libres, pas de distraction visuelle en guidage)

## Scénarios de test (dans Paramètres ⚙️)
Tout droit, Droite, Gauche, Demi-tour, Virage raté, Recalcul, Trafic, Radar, Tunnel, Arrivée

## Reset trajet
Quand l'utilisateur clique "Arrêter le trajet":
- Route effacée de la carte + marqueurs supprimés
- Bande d'instructions masquée
- Mode plein écran désactivé
- Formulaire de recherche réaffiché (bottom sheet remonte)
- Voix arrêtée + WakeLock relâché
- Prêt pour un nouveau trajet

## Règles de développement
1. **Toujours push vers GitHub** après modification (déploiement auto)
2. **Bumper le SW** (CACHE_NAME version) à chaque changement pour forcer le refresh
3. **SVG inliné** dans le HTML (pas de fichiers externes bloqués par le SW)
4. **Tester en mode incognito** pour contourner le cache navigateur
5. **Un seul fichier HTML** — pas de framework, pas de build step
6. **100% gratuit** — aucune API payante, aucun compte requis
7. **Voix naturelles** — nettoyer TOUTE ponctuation avant TTS, segments longs, variations subtiles
8. **Geocoding intelligent** — Nominatim quand numéro civique détecté, Photon sinon
9. **mousedown + touchstart** pour les items autocomplétion (pas click — race condition avec blur)
10. **Copier index.html dans /c/temp/gps-drole/** après édition pour le preview local

## Évolution future envisagée
- React Native + Mapbox pour publication sur app stores
- ElevenLabs pour voix IA réalistes (payant ~5-22$/mois)
- Capacitor wrapper pour accès APIs natives (WiFi, notifications push)
- Android Auto / CarPlay
- Partage de position en temps réel (WebSocket/Firebase)
- Points d'intérêt proches (stations, restos, toilettes via Overpass API)
- Alertes de vitesse par zone (API Overpass)
- Achievements / gamification ("100 km parcourus!", badges)
- Nouveaux personnages: Professeur, Pirate, Robot, Commentateur sportif
- Répliques contextuelles selon l'heure/météo/vitesse
- Easter eggs (répliques rares 1/50)
