# GPS DRÔLE v4.5 — Prompt de continuation complet

## Identité
Application GPS humoristique PWA standalone. Un seul fichier HTML (4700+ lignes) contenant tout le CSS, JS et HTML. Personnages drôles qui donnent des directions de navigation avec humour, sarcasme ou insultes selon le mode choisi.

## Liens
- **Repo:** https://github.com/jcaron149-ux/gps-drole
- **Live:** https://jcaron149-ux.github.io/gps-drole/
- **Déploiement:** GitHub Pages auto (push master → live)
- **Branche:** master

## Stack technique (100% gratuit)
- **Carte:** Leaflet.js 1.9.4 + CartoDB dark_matter (tuiles sombres)
- **Routing:** OSRM (routes alternatives incluses)
- **Geocoding:** Nominatim (prioritaire pour adresses avec numéro civique) + Photon API (noms de lieux)
- **Voix:** Web Speech API (Natural Speech Engine v2, 6 techniques anti-synthétique)
- **Limites vitesse:** Overpass API (données OSM temps réel)
- **Radars:** Overpass API (speed_camera OSM)
- **Météo:** Open-Meteo API (gratuit, sans clé)
- **PWA:** Service Worker v13 (network-first) + manifest.json
- **Stockage:** localStorage (favoris, nom, historique, route cache, préférences routing)
- **APIs navigateur:** Geolocation, Fullscreen, WakeLock, Vibration, Web Share, Media Session

## Architecture fichiers
```
gps-drole/
├── index.html          (4700+ lignes — app monolithe complète)
├── sw.js               (97 lignes — Service Worker v13, network-first)
├── manifest.json       (20 lignes — config PWA)
├── logo-concept.svg    (logo SVG — visage crâne/sourire)
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

## Fonctionnalités complètes v4.5

### Navigation & carte
- GPS temps réel (watchPosition + badge vitesse en haut à gauche)
- Carte sombre CartoDB dark_matter
- Route OSRM avec étapes détaillées
- **Routes alternatives** (2 options grises cliquables pour changer)
- Turn-by-turn v2: 3 annonces/virage (500m, 200m, 30m) + noms de rues
- Recalcul auto hors route (ancienne route conservée pendant recalcul)
- ETA dynamique en temps réel
- Détection auto USA → MPH/feet
- Pré-chargement tuiles le long de la route
- Numéros civiques pris en charge (Nominatim avec viewbox local)
- **Calcul automatique** à la sélection de destination (pas de bouton CALCULER)
- Coordonnées autocomplétion réutilisées (évite double geocoding)
- **Geocode parallélisé** (Promise.all — départ + waypoints + destination simultanés)
- Adresse de départ personnalisable
- **Éviter péages/autoroutes** (toggles dans Paramètres > Navigation)
- **Smart zoom** selon la vitesse (zoom out autoroute, zoom in ville)

### Limite de vitesse & radars
- **Limite de vitesse réelle** depuis OSM via Overpass API (badge rouge à côté de la vitesse)
- **Alertes radars/caméras** (icônes 📷 sur carte + alerte vocale à 300m)
- Query throttlée (vitesse: 15s, caméras: 60s)

### Météo
- **Widget météo** en haut à droite après calcul de route
- Open-Meteo API (gratuit, sans clé) — icône + température + description
- Conversion auto °F en USA

### Mode plein écran & guidage
- Fullscreen API au démarrage du guidage
- Bande d'instructions bleue en haut
- Boutons tous **à gauche** pendant le guidage:
  - 🎯 Recentrer (rond bleu, pulse quand la carte est déplacée)
  - 📍 Modifier destination (en cours de trajet, sans perdre la route)
  - ⏹ ARRÊTER (rouge)
- Vue 3D inclinée + flèche directionnelle

### Modifier destination en cours de trajet
- Popup pour entrer la nouvelle adresse
- L'ancienne route reste visible pendant le recalcul
- Recalcul depuis la position actuelle (pas le départ original)
- Annonce vocale de la nouvelle distance
- Météo mise à jour pour la nouvelle destination
- Le guidage continue sans interruption

### Bouton Recentrer 🎯
- Gros bouton rond bleu en bas à gauche pendant le guidage
- Animation pulse quand l'utilisateur déplace la carte manuellement
- Recentre avec smart zoom adapté à la vitesse
- Animation s'arrête au recenter

### Mode Conduite (HUD)
- Interface ultra-simplifiée: vitesse en gros, flèche directionnelle, distance au virage, ETA
- Tout le reste masqué pour zéro distraction
- Mise à jour toutes les 2 secondes

### Alerte fatigue
- Après 2h de conduite continue: popup + réplique humoristique personnalisée
- Messages en FR/EN/ES avec le prénom de l'utilisateur
- Vibration d'alerte
- Timer se réinitialise quand l'utilisateur accepte
- Désactivable dans Paramètres > Navigation

### Voix — Natural Speech Engine v2
- 6 techniques anti-synthétique:
  1. Multi-utterance: segments longs (max 80 car, max 3 segments)
  2. Variation dynamique: rate ±5%, pitch ±4%
  3. Text hacking: TOUTE ponctuation supprimée
  4. Intonation contour: pitch monte pour questions, descend en fin
  5. Emphase par volume: mots CAPS plus forts
  6. Respiration simulée: pauses variables
- Son ding 880Hz + vibration aux virages
- Répliques seulement lors des directives (pas tous les 200m)
- Texte des répliques NON affiché
- Sélection voix: Natural > Google > Legacy
- **Bouton ON/OFF + slider vitesse** dans Paramètres > Synthèse vocale

### Recherche le long de la route (POI)
- Boutons POI (⛽🍔🚻🏥☕) cherchent le long du trajet actif
- Si pas de trajet → cherche autour de la position
- Overpass API avec échantillonnage de 5 points le long de la route

### Partager ETA
- Bouton "Partager ETA" dans la section POI
- Web Share API (mobile) ou copie presse-papier (desktop)
- Message personnalisé avec prénom, heure d'arrivée, distance restante

### PWA & hors-ligne
- SW v13 network-first pour app + cache-first pour tuiles
- Route sauvegardée en localStorage pour survie hors-ligne
- Pré-chargement tuiles le long de la route
- Avertissement vocal si recalcul échoue hors-ligne
- WakeLock: écran allumé pendant guidage

### Interface
- Bottom sheet style Google Maps — ouvert par défaut à 50vh
- Thème par personnage (couleurs dynamiques)
- Glassmorphism (backdrop-filter blur)
- Splash screen avec logo SVG crâne/sourire animé
- Confettis à l'arrivée
- Indicateur vitesse + limite en haut à gauche
- Widget météo en haut à droite
- Bouton "Effacer" petit et discret

### Paramètres (⚙️)
- **Profil:** Nom utilisateur (personnalise les répliques)
- **Synthèse vocale:** ON/OFF + slider vitesse (0.6x-1.5x) + tester la voix
- **Navigation:** Éviter péages, éviter autoroutes, routes alternatives, alertes radars, alerte fatigue
- **Scénarios de test:** 10 boutons (tout droit, droite, gauche, demi-tour, etc.)
- **Données:** Effacer historique, effacer favoris

### Personnalisation
- Nom utilisateur (demandé au premier lancement après disclaimer)
- Répliques personnalisées avec le prénom
- Favoris: Maison/Travail + liste personnalisée
- Historique trajets avec auto-suppression après 7 jours

### Logo
- Visage unique coupé au milieu: crâne anatomique (gauche) + visage jaune qui rit (droite)
- 2 yeux, 1 nez, 1 bouche partagés entre les deux moitiés
- Le Ô de DRÔLE = smiley jaune avec accent circonflexe
- Sous-titre: "À en mourir de rire"
- Pin GPS bleu au sommet

### Sécurité & légal
- Disclaimer langage grossier à CHAQUE visite
- Bouton "J'ACCEPTE ET JE CONTINUE" obligatoire
- Aucune donnée transmise (tout en localStorage)
- Conforme lois Canada/USA (mains libres)

## Reset trajet
Quand l'utilisateur clique "Arrêter":
- Route + marqueurs + alternatives effacés
- Bande d'instructions masquée
- Mode plein écran désactivé
- Boutons guidage (recentrer, dest, arrêter) masqués
- Bottom sheet remonte, formulaire réaffiché
- Voix arrêtée + WakeLock relâché

## Règles de développement
1. **Toujours push vers GitHub** après modification
2. **Bumper le SW** (CACHE_NAME) à chaque changement
3. **SVG inliné** dans le HTML (pas de fichiers externes)
4. **Tester en mode incognito** pour contourner le cache
5. **Un seul fichier HTML** — pas de framework
6. **100% gratuit** — aucune API payante
7. **Voix:** nettoyer TOUTE ponctuation, segments longs, variations subtiles
8. **Geocoding:** Nominatim quand numéro civique, Photon sinon
9. **mousedown + touchstart** pour autocomplétion (pas click)
10. **Copier index.html dans /c/temp/gps-drole/** pour preview local
11. **Geocode en parallèle** (Promise.all) pour rapidité
12. **Overpass API throttlée** (vitesse 15s, caméras 60s)

## Évolution future
- React Native + Mapbox (app stores)
- ElevenLabs voix IA réalistes (payant)
- Capacitor pour APIs natives (WiFi, notifications push)
- Android Auto / CarPlay
- Partage de position en temps réel
- Achievements / gamification
- Nouveaux personnages
- Répliques contextuelles (heure, météo, vitesse)
- Easter eggs (répliques rares 1/50)
