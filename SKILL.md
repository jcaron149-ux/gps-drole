# SKILL — GPS DRÔLE 🗺️😂
## Projet: Application GPS Humoristique Interactif
**Version:** 1.4
**Fichier principal:** `index.html` (fichier HTML unique, ~847 lignes)
**Repo GitHub:** https://github.com/jcaron149-ux/gps-drole
**Stack:** 100% gratuit — OpenStreetMap + Leaflet.js + OSRM + Web Speech API

---

## 1. CONTEXTE DU PROJET

Application GPS interactive avec personnalités humoristiques, développée pour tests et démonstration.
Propriétaire : GRYB International
Objectif futur : commercialisation via React Native + Mapbox si investissement.

### Ce que l'application fait
- Navigation GPS avec carte interactive (OpenStreetMap)
- **Suivi GPS temps réel** via `watchPosition` (marqueur 🚗 se déplace en continu)
- **Badge vitesse** toujours visible (km/h + cap/direction boussole)
- **Cercle de précision** bleu autour de la position (±X mètres)
- **Bouton centrer** 🎯 (recentre la carte + suivi auto)
- Calcul d'itinéraires avec waypoints (OSRM)
- Instructions vocales humoristiques selon le mode actif
- 5 modes de personnalité × 3 personas de voix chacun
- **Voix optimisées** : chaque persona a sa voix préférée + pitch/rate/volume calibrés
- 3 langues (FR / EN / ES) + mode bilingue ES→FR mystère
- 10 scénarios de test (virages, radar, tunnel, arrivée, etc.)

### Changements v1.3 → v1.4
- Carte s'affiche immédiatement (Montréal par défaut), puis recentre si GPS disponible
- GPS temps réel via `watchPosition` avec haute précision
- Badge vitesse permanent (km/h + boussole N/NE/E/SE/S/SO/O/NO + degrés)
- Cercle de précision GPS (bleu, rayon = accuracy)
- Bouton 🎯 centrer sur soi (désactivation auto si drag manuel)
- Voix optimisées par persona avec `preferVoice` (sélection intelligente)
- Volume ajustable par persona
- Fix `catch()` → `catch(e)` pour compatibilité navigateurs

---

## 2. ARCHITECTURE TECHNIQUE

### Stack (tout gratuit, zéro API key)
| Composante | Technologie | URL/Source |
|---|---|---|
| Carte | Leaflet.js 1.9.4 | unpkg.com/leaflet@1.9.4 |
| Tuiles carte | OpenStreetMap | tile.openstreetmap.org |
| Calcul de route | OSRM (public) | router.project-osrm.org |
| Géocodage | Nominatim | nominatim.openstreetmap.org |
| Synthèse vocale | Web Speech API | Natif navigateur (Chrome recommandé) |
| Fonts | Google Fonts | Orbitron + Exo 2 |

### Structure du fichier HTML
```
index.html (~847 lignes)
├── <style>          CSS complet (vars CSS, layout, animations, live GPS)
├── <header>         Logo + tagline + info stack
├── .modes-bar       5 boutons de mode
├── .lang-bar        4 boutons de langue
├── .main (grid)
│   ├── #map         Carte Leaflet + toast + bouton centrer 🎯 + badge vitesse
│   └── .panel
│       ├── .char-box        Avatar + nom + desc + personas + test voix
│       ├── .instr-box       Instruction courante (flash animé)
│       ├── #biBox           Mode bilingue ES→FR
│       ├── .demo-section    10 boutons scénarios
│       ├── .itin-section    Planificateur d'itinéraire
│       └── .voice-section   Toggle voix + slider vitesse
├── .status-bar      Statut + indicateur mode/langue
└── <script>
    ├── PERSONAS      Config voix par mode (15 personas + preferVoice)
    ├── P             Database phrases (5 modes × 3 langues × 10 scénarios)
    ├── BI            Phrases mode bilingue ES→FR
    ├── STATE         Variables d'état (mode, lang, map, voix, watchId, etc.)
    ├── MAP           initMap(), quickDest()
    ├── GPS LIVE      startTracking(), centerOnUser(), watchPosition
    ├── ITINERARY     addWp(), removeWp(), geocode(), calcRoute(), osrmRoute(), clearRoute()
    ├── MODE & LANG   setMode(), setLang(), renderPersonas(), applyPersona(), testVoice()
    ├── SCENARIOS     go(), goBilingual()
    ├── SPEECH        speak(), speakThen(), pickVoice() [avec preferVoice], getVoices(), toggleVoice()
    └── UI HELPERS    showInstr(), animChar(), setStatus(), showToast()
```

---

## 3. MODES ET PERSONAS

### 5 Modes de personnalité
| Mode | ID | Avatar | Ton |
|---|---|---|---|
| Grand-maman | `grandmaman` | 👵 | Doux, encourageant, répète |
| Enfant à bord | `enfant` | 👶 | Excité, jeux vidéo, tout en majuscules |
| Gang de chums | `amis` | 🍺 | Insultes affectueuses, moque le chauffeur |
| Extrême drôle | `drole` | 😂 | Sarcastique, répliques film, absurde |
| Extrême insulte | `insulte` | 💀 | Gordon Ramsay vibes, brutal |

### 3 Personas de voix par mode (avec voix préférées optimisées)
```javascript
// Structure d'un persona v1.4
{ id, label, av, name, rate, pitch, volume, gender, desc, preferVoice:[] }

// Grand-maman
👵 Lise     (rate:.68, pitch:.65, vol:.9)  → Microsoft Nathalie (fr-CA)
🤭 Betty    (rate:.82, pitch:.95, vol:1)   → Google UK English Female
🎩 Katharine(rate:.62, pitch:.75, vol:.85) → Google UK English Female

// Enfant
🐟 Dory     (rate:1.45, pitch:1.85, vol:1)→ Microsoft Caroline (fr-CA)
🚀 Buzz     (rate:.95,  pitch:.70,  vol:1)→ Google UK English Male
🦁 Timon    (rate:1.30, pitch:1.50, vol:1)→ Google US English

// Gang de chums
💀 Deadpool (rate:1.15, pitch:1.05, vol:1)→ Google US English
😂 Seth     (rate:.88,  pitch:.82, vol:.95)→ Google US English
🏺 Kronk    (rate:.82,  pitch:.72,  vol:1)→ Microsoft Claude (fr-CA)

// Extrême drôle
🎙️ Morgan   (rate:.72, pitch:.50, vol:.85)→ Google UK English Male
📺 Ron      (rate:1.08, pitch:.88,  vol:1)→ Google US English
🤖 Jarvis   (rate:.88,  pitch:.78, vol:.9)→ Google UK English Male

// Extrême insulte
👨‍🍳 Gordon  (rate:1.25, pitch:.85,  vol:1)→ Google UK English Male
💂 Ermey   (rate:1.35, pitch:.70,  vol:1)→ Google US English
🌌 Thanos  (rate:.72,  pitch:.42, vol:.8)→ Google UK English Male
```

### Logique de sélection de voix (pickVoice)
1. Cherche dans `preferVoice[]` du persona actif (match partiel sur `voice.name`)
2. Fallback: filtre par langue + genre
3. Fallback final: première voix disponible

---

## 4. GPS TEMPS RÉEL

### Initialisation
```javascript
// Carte affichée immédiatement (Montréal par défaut)
initMap(45.5017, -73.5673);
// Puis tentative GPS avec timeout 8s
navigator.geolocation.getCurrentPosition(success, error, {
  enableHighAccuracy: true, timeout: 8000, maximumAge: 0
});
```

### Suivi continu (startTracking)
```javascript
watchId = navigator.geolocation.watchPosition(pos => {
  // Met à jour: marqueur 🚗, cercle précision, carte (si followUser)
  // Met à jour: badge vitesse (km/h), cap/boussole (N/NE/E/SE/S/SO/O/NO)
}, error, {enableHighAccuracy:true, maximumAge:3000, timeout:10000});
```

### Éléments UI temps réel
- **Badge vitesse** (bas gauche carte): chiffre gros + KM/H + direction boussole
- **Bouton 🎯** (bas droite carte): recentre + réactive le suivi auto
- **Cercle bleu**: rayon = accuracy GPS en mètres
- **Suivi auto**: carte suit la position. Se désactive si drag manuel → clic 🎯 pour réactiver

---

## 5. DATABASE DE PHRASES

### Structure
```javascript
P[mode][langue][scenario] = ["phrase1", "phrase2", ...]
```

### 10 Scénarios par mode/langue
`straight` · `right` · `left` · `uturn` · `missed` · `recalc` · `traffic` · `speed` · `tunnel` · `arrived`

### Mode bilingue ES→FR Mystère
```javascript
BI[scenario] = {
  es: "Instruction espagnole",
  fr: ["Réplique française 1", "Réplique française 2"]
}
```

---

## 6. FONCTIONS CLÉS

### Carte et routage
```javascript
initMap(lat, lng)          // Init carte Leaflet + marqueur position
quickDest(lat, lng)        // Clic carte → destination directe + route OSRM
calcRoute()                // Lit départ/étapes/destination → appelle osrmRoute()
osrmRoute(pts)             // [{lat,lng,name}] → tracé route + marqueurs colorés
geocode(query)             // Nominatim → {lat,lng,name} ou null
addWp() / removeWp(n)     // Ajouter/supprimer étapes intermédiaires (max 4)
clearRoute()               // Efface tout (route, marqueurs, inputs)
```

### GPS temps réel
```javascript
startTracking()            // Lance watchPosition, met à jour marqueur/vitesse/cap
centerOnUser()             // Recentre carte + réactive followUser
```

### Voix
```javascript
speak(txt, lang)           // Synthèse vocale avec profil du persona actif + volume
pickVoice(lang, gender)    // Cherche preferVoice du persona, puis fallback langue/genre
getP()                     // Retourne le persona actif du mode courant
testVoice()                // Joue phrase sample du mode actif
```

### Scénarios
```javascript
go(scenario)               // Joue phrase aléatoire du mode+langue+scénario
goBilingual(scenario)      // Mode ES→FR: parle ES puis répond FR
```

---

## 7. PLAN D'ÉVOLUTION (si commercialisation)

### Étape 1 — Validation gratuite (actuel v1.4)
✅ HTML unique, tout gratuit, démo mobile browser, GPS temps réel

### Étape 2 — PWA (Progressive Web App)
- Installable depuis le browser sur téléphone
- Service worker pour offline
- Manifest.json + icônes
- ~1-2 semaines de dev

### Étape 3 — App Mobile Commerciale
- **Framework:** React Native (iOS + Android)
- **Navigation:** Mapbox Navigation SDK (turn-by-turn GPS)
- **Voix custom:** ElevenLabs API (~$5-22/mois)
- **Stores:** Apple App Store ($99/an) + Google Play ($25 unique)
- **Timeline:** 3-6 mois MVP
- **Monétisation suggérée:** Gratuit + modes premium ($2.99) ou abonnement ($0.99/mois)

### Fonctionnalités futures planifiées
- ⏱️ Blague/devinette automatique après 5-10 min de route
- 🏘️ Histoires historiques des villages traversés (Wikipedia API)
- 🌙 Faits divers/crimes selon l'heure (jour/nuit)
- 👻 Mode "Histoire épeurante" sur la route
- 📊 Score d'erreurs affiché à l'arrivée
- 🌤️ Intégration météo (commentaire contextuel)
- 🎤 Commandes vocales pour changer de mode
- 🗣️ Voix réelles via ElevenLabs (clonage voix)

---

## 8. TESTS DE VÉRIFICATION

```python
with open('index.html') as f:
    src = f.read()

checks = {
    '5 modes bar': src.count('data-mode=') == 5,
    '24+ fonctions JS': all(f'function {fn}(' in src for fn in
        ['initMap','setMode','setLang','go','goBilingual','speak','speakThen',
         'toggleVoice','showInstr','animChar','renderPersonas','applyPersona',
         'testVoice','getP','pickVoice','getVoices','calcRoute','osrmRoute',
         'addWp','removeWp','clearRoute','geocode','setStatus','showToast',
         'startTracking','centerOnUser']),
    '15 personas voix': sum(1 for p in ['Lise','Betty','Katharine','Dory','Buzz',
        'Timon','Deadpool','Seth','Kronk','Morgan','Ron','Jarvis','Gordon','Ermey','Thanos']
        if p in src) == 15,
    'preferVoice présent': 'preferVoice' in src,
    'watchPosition GPS': 'watchPosition' in src,
    'speedVal badge': 'speedVal' in src,
    'headingVal cap': 'headingVal' in src,
    'centerOnUser': 'centerOnUser' in src,
    '10 scénarios': all(f"go('{s}')" in src for s in
        ['straight','right','left','uturn','missed','recalc','traffic','speed','tunnel','arrived']),
    'OSRM endpoint': 'router.project-osrm.org' in src,
    'Nominatim': 'nominatim.openstreetmap.org' in src,
    'Accolades équilibrées': src.count('{') == src.count('}'),
    'Parenthèses équilibrées': src.count('(') == src.count(')'),
}
for name, ok in checks.items():
    print(f"{'✅' if ok else '❌'} {name}")
```

**Résultat attendu:** 13/13 ✅

---

## 9. DÉPLOIEMENT

### Option A — Fichier local
Ouvrir `index.html` dans Chrome. Tout fonctionne sans serveur.

### Option B — GitHub Pages (gratuit)
```bash
# Repo existant: https://github.com/jcaron149-ux/gps-drole
git add index.html && git commit -m "GPS Drôle v1.4"
git push origin master
# Activer GitHub Pages → Settings → Pages → master branch
```

### Option C — Netlify (gratuit)
1. Connecter le repo GitHub `jcaron149-ux/gps-drole` à Netlify
2. Ou drag & drop du fichier `index.html`
3. Chaque push = déploiement automatique

---

## 10. PROMPT DE CONTINUATION

Si une nouvelle conversation reprend ce projet, utiliser ce prompt :

```
Je travaille sur l'application GPS DRÔLE v1.4 — un GPS humoristique HTML single-file.
Repo: https://github.com/jcaron149-ux/gps-drole

Stack: Leaflet.js + OpenStreetMap + OSRM + Web Speech API (100% gratuit)

5 modes: grandmaman / enfant / amis (gang de chums) / drole / insulte
3 personas voix par mode avec preferVoice optimisé (15 personas total)
  - Chaque persona a: rate, pitch, volume, preferVoice[] (voix browser préférées)
  - Ex: Thanos → Google UK English Male, pitch .42, rate .72 (ultra grave + lent)
  - Ex: Dory → Microsoft Caroline, pitch 1.85, rate 1.45 (aiguë + rapide)
3 langues: FR / EN / ES + mode bilingue ES→FR mystère
10 scénarios: straight/right/left/uturn/missed/recalc/traffic/speed/tunnel/arrived

GPS TEMPS RÉEL (v1.4):
- watchPosition avec haute précision
- Badge vitesse permanent (km/h + boussole N/NE/E/SE/S/SO/O/NO + degrés)
- Cercle de précision bleu (accuracy)
- Bouton 🎯 centrer + suivi auto (se désactive si drag manuel)
- Carte s'affiche immédiatement (Montréal défaut), puis recentre si GPS ok

Itinéraire multi-étapes: départ + 4 waypoints max + destination via OSRM

Fonctionnalités planifiées mais pas encore développées:
- Blague/devinette auto après 5-10 min
- Histoires historiques des villages (Wikipedia API)
- Faits divers selon jour/nuit
- Mode histoire épeurante

Le fichier fait ~847 lignes HTML. Avant tout changement:
1. Montrer les modifications ici pour approbation
2. Tester avec le script Python du SKILL.md
3. Reconstruire proprement si trop de patches accumulés
```

---

## 11. HISTORIQUE DES VERSIONS

| Version | Changements |
|---|---|
| v1.0 | Base: carte, 5 modes, 3 langues, voix, scénarios |
| v1.1 | Mode amis refait "gang de chums", répliques films ajoutées (FR+EN+ES) |
| v1.2 | 6 modes voix ajoutés (Robot/Yoda/Commentateur/Vampire/Cowboy/Shakespeare) |
| v1.3 | 6 modes supprimés, 15 personas voix (3/mode), itinéraire multi-étapes, rebuilt clean |
| v1.4 | GPS temps réel (watchPosition), badge vitesse+boussole, cercle précision, bouton centrer, voix optimisées par persona (preferVoice+volume), carte init immédiate, fix catch() |

---

*Skill mis à jour le 28 mars 2026 — GPS DRÔLE v1.4 — GRYB International*
