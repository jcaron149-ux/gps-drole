# SKILL — GPS DRÔLE v3.3
## Application GPS Humoristique — PWA Installable
**Fichier principal:** `index.html` (2497 lignes, monolithe HTML/CSS/JS)
**Repo GitHub:** https://github.com/jcaron149-ux/gps-drole
**Live:** https://jcaron149-ux.github.io/gps-drole/
**Stack:** 100% gratuit — OpenStreetMap + Leaflet.js + OSRM + Photon + Web Speech API

---

## 1. FONCTIONNALITÉS COMPLÈTES

### Navigation GPS
- Carte interactive OpenStreetMap (Leaflet.js)
- GPS temps réel via `watchPosition` (marqueur voiture se déplace)
- Badge vitesse permanent (km/h ou MPH si USA) + cap boussole
- Cercle de précision bleu GPS
- Calcul d'itinéraire multi-étapes (OSRM) avec waypoints (max 4)
- Détection auto USA → bascule en MPH/feet

### Guidage Turn-by-Turn v2
- 3 annonces par virage: 500m (pré-alerte), 200m (rappel), 30m (instruction)
- Noms de rues: "Dans 500m, tournez à droite sur Rue Saint-Laurent"
- Types détaillés: léger, serré, fork, merge, rond-point, demi-tour
- Distance au prochain virage après chaque instruction
- ETA dynamique mise à jour en temps réel selon vitesse
- Recalcul automatique si >100m hors route (toutes les 10s)
- Arrivée auto: guidage s'arrête à 30m de destination
- Instructions en 3 langues (FR/EN/ES)

### Mode Guidage Plein Écran
- Header, modes, langues, status bar masqués
- API Fullscreen navigateur (masque barre d'adresse)
- Carte = 100% de l'écran
- Overlay flottant affiche l'instruction en cours
- Bouton ARRETER rouge flottant
- Barre ETA/Temps/Distance en haut
- WakeLock: écran reste allumé

### PWA (Progressive Web App)
- `manifest.json` + icônes 192/512px
- Service worker (`sw.js`): cache app shell + tuiles carte
- Mode hors-ligne: tuiles déjà visitées disponibles sans réseau
- Banner "Installer GPS Drole" sur mobile
- Installable sur écran d'accueil (Android + iOS)

### Moteur Vocal Naturel v2 (6 techniques anti-synthétique)
1. **Multi-utterance**: phrases découpées en segments avec pauses réelles
2. **Variation dynamique**: rate ±8%, pitch ±6% par segment
3. **Text hacking**: micro-pauses sur mots de liaison (bon, pis, t'sais)
4. **Intonation contour**: pitch monte en question (+12%), descend en fin (-8%)
5. **Emphase volume**: mots CAPS = +15% volume
6. **Respiration simulée**: pauses 120-700ms avec variabilité humaine
- File d'attente vocale (instructions ne se coupent pas)
- Son "ding" 880Hz (AudioContext) avant chaque instruction
- Vibration mobile (100ms) à chaque virage

### Recherche d'Adresse
- Photon API (Komoot) avec biais géographique (lat/lon utilisateur)
- Résultats locaux priorisés (pas à l'autre bout du monde)
- Fallback Nominatim avec viewbox ±2° autour de la position
- Autocomplétion 300ms debounce, 5 résultats

### Favoris (localStorage)
- Raccourcis rapides: Maison + Travail (1 clic = route calculée)
- Favoris personnalisés illimités (Gym, Garderie, etc.)
- Long press (1.5s) pour réinitialiser Maison/Travail
- Tout persiste entre sessions (localStorage)

### Interface
- Thème sombre/clair (localStorage)
- Mode nuit automatique selon l'heure
- Mobile portrait: boutons agrandis, touch-friendly
- Mobile paysage: header masqué, carte plein écran + panneau compact
- 3 langues: FR / EN / ES

---

## 2. ARCHITECTURE

### Fichiers
```
gps-drole/
├── index.html      (2497 lignes — CSS + HTML + JS monolithe)
├── manifest.json   (PWA manifest)
├── sw.js           (Service worker: cache app shell + tuiles)
├── icon-192.png    (Icône PWA)
├── icon-512.png    (Icône PWA)
├── SKILL.md        (Ce fichier)
└── test-voix.html  (Page test voix legacy)
```

### Stack (tout gratuit)
| Composante | Technologie |
|---|---|
| Carte | Leaflet.js 1.9.4 |
| Tuiles | OpenStreetMap |
| Routage | OSRM (router.project-osrm.org) |
| Recherche | Photon (photon.komoot.io) + Nominatim fallback |
| Voix | Web Speech API (natif navigateur) |
| Fonts | Google Fonts (Orbitron + Exo 2) |

### Structure JS (dans index.html)
```
PERSONAS         15 configs voix (5 modes × 3 personas)
P                Database phrases (5 modes × 3 langues × 10 scénarios)
STATE            Variables globales (mode, lang, map, GPS, route, etc.)
AUTO-DETECT USA  detectCountry() → MPH si coordonnées USA
THEME            toggleTheme() + localStorage
MAP              initMap(), quickDest()
GPS INIT         getCurrentPosition → initMap sur position réelle
GPS TRACKING     startTracking() + watchPosition
AUTOCOMPLETE     setupAutocompletePhoton() (Photon + Nominatim fallback)
ITINERARY        calcRoute(), osrmRoute(), clearRoute(), addWp()
GUIDANCE         startGuidance(), stopGuidance(), toggleGuidance()
ROUTE INFO       updateRouteInfoBar(), updateRouteProgress()
AUTO-REROUTE     startRerouteDetection() (>100m hors route)
TURN-BY-TURN v2  checkTurnByTurn() (3 annonces: 500m/200m/30m)
INSTRUCTIONS     buildPreAnnounce(), buildStepInstruction(), getActionText()
HAVERSINE        haversine() distance en mètres
MODE/LANG        setMode(), setLang(), renderPersonas(), applyPersona()
SCENARIOS        go() → phrase aléatoire + voix + animation
SPEECH SYNTH     pickVoice(), getVoices()
NATURAL ENGINE   humanizeText(), splitIntoSegments(), speak() v2
VOICE QUEUE      File d'attente (pas couper la parole)
VIBRATION/DING   playDing() 880Hz + navigator.vibrate()
FAVORITES        getFavorites(), saveFavorites(), useFav(), renderFavorites()
GPS THROTTLE     1 update/sec max (économie batterie)
PWA              Service worker registration + install prompt
WAKELOCK         requestWakeLock() pendant guidage
INIT             load event → personas, autocomplete, favoris, nuit auto
```

---

## 3. MODES ET PERSONAS (15 total)

| Mode | Personas | Ton |
|---|---|---|
| Grand-maman | Janette, Betty, Katharine | Doux, chaleureux, encourageant |
| Enfant à bord | Dory, Buzz, Timon | Excité, jeux vidéo, CAPS |
| Gang de chums | Deadpool, Seth, Kronk | Insultes affectueuses, humour |
| Extrême drôle | Morgan, Ron, Jarvis | Sarcastique, documentaire, IA |
| Extrême insulte | Gordon, Ermey, Thanos | Brutal, rage, calme menaçant |

Chaque persona a: `rate`, `pitch`, `volume`, `gender`, `preferVoice` (par langue)

### 10 Scénarios
`straight` · `right` · `left` · `uturn` · `missed` · `recalc` · `traffic` · `speed` · `tunnel` · `arrived`

---

## 4. DÉPLOIEMENT

### GitHub Pages (actuel)
```bash
git add -A && git commit -m "message" && git push origin master
# Auto-déployé sur https://jcaron149-ux.github.io/gps-drole/
```

### Test mobile
1. Ouvrir le lien dans Chrome (Android) ou Safari (iOS)
2. Banner "Installer" apparaît → cliquer INSTALLER
3. L'app s'installe sur l'écran d'accueil comme une app native

---

## 5. PROMPT DE CONTINUATION

```
Je travaille sur GPS DRÔLE v3.3 — GPS humoristique PWA installable.
Repo: https://github.com/jcaron149-ux/gps-drole
Live: https://jcaron149-ux.github.io/gps-drole/

Fichier unique index.html (2497 lignes) + sw.js + manifest.json
Stack: Leaflet.js + OpenStreetMap + OSRM + Photon API + Web Speech API (100% gratuit)

FONCTIONNALITÉS:
- GPS temps réel (watchPosition + badge vitesse km/h ou MPH)
- Guidage turn-by-turn v2: 3 annonces par virage (500m/200m/30m) + noms de rues
- Mode plein écran avec API Fullscreen (tout masqué sauf carte + instructions)
- Recalcul auto si hors route + ETA dynamique
- PWA installable + service worker + mode hors-ligne (tuiles en cache)
- Moteur vocal naturel v2: 6 techniques anti-synthétique (multi-utterance, variation, intonation)
- File d'attente vocale + son ding + vibration aux virages
- Recherche Photon API avec biais local (résultats proches priorisés)
- Favoris: Maison/Travail (raccourcis) + liste personnalisée (localStorage)
- WakeLock: écran reste allumé pendant guidage
- 5 modes × 3 personas × 3 langues × 10 scénarios
- Thème sombre/clair + mode nuit auto + mobile paysage optimisé
- Détection auto USA → MPH/feet

Personas: Janette/Betty/Katharine, Dory/Buzz/Timon, Deadpool/Seth/Kronk,
Morgan/Ron/Jarvis, Gordon/Ermey/Thanos

Toujours push vers GitHub après modification (déploiement Netlify/Pages auto).
```

---

## 6. HISTORIQUE

| Version | Changements |
|---|---|
| v1.0-1.4 | Base: carte, modes, voix, GPS temps réel, badge vitesse |
| v2.0 | Voix anti-Siri optimisées, personas avec preferVoice, clean rewrite |
| v2.1 | Janette Bertrand pour grandmaman, voix optimisées par persona |
| v3.0 | PWA installable, service worker, mode hors-ligne, ding+vibration, file vocale, Photon API, throttle GPS, mobile optimisé |
| v3.1 | Mode guidage plein écran, suivi GPS amélioré, suggestions locales |
| v3.2 | Turn-by-turn v2: 3 annonces/virage, noms de rues, instructions précises |
| v3.3 | Favoris (Maison/Travail + liste), API Fullscreen, vrai plein écran |

*Mis à jour le 28 mars 2026 — GPS DRÔLE v3.3*
