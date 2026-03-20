# Dethroned — Guide Architecture

Site de documentation technique pour l'architecture Manager Graph de *Dethroned: The King's Den*.

---

## Structure du projet

```
dethroned-guide/
├── index.html        ← Shell : CSS global, navigation dynamique, JS core
├── nav.json          ← Source de vérité de la navigation (éditable)
├── pages/
│   ├── home.html
│   ├── decision.html
│   ├── hierarchy.html
│   ├── entity.html
│   ├── communication.html
│   ├── skills-flow.html
│   ├── triggers.html
│   ├── effects.html
│   ├── special.html
│   ├── godot-setup.html
│   ├── godot-optim.html
│   ├── add-content.html
│   ├── glossary.html
│   ├── integration-prompt.html
│   └── arena_forge_integration.html
└── README.md
```

---

## Lancer le site en local

> ⚠️ Le site utilise `fetch()` pour charger les pages — il **ne fonctionne pas** en ouvrant `index.html` directement dans le navigateur (protocole `file://`). Il faut un serveur HTTP local.

### Option 1 — Python (installé partout)
```bash
cd dethroned-guide
python3 -m http.server 8080
# Ouvrir : http://localhost:8080
```

### Option 2 — Node.js
```bash
npx serve .
# Ouvrir l'URL affichée dans le terminal
```

### Option 3 — VS Code Live Server
Installer l'extension **Live Server** → clic droit sur `index.html` → *Open with Live Server*.

---

## Ajouter une page

### Étape 1 — Créer le fichier `pages/mon-sujet.html`

Les fragments de page sont du HTML **sans** balises `<html>`, `<head>` ou `<body>`.
Ils sont injectés dynamiquement dans `#page-container` par `index.html`.

**Structure minimale :**
```html
<div class="page-hero">
  <h1>Titre</h1>
  <p class="lead">Description.</p>
</div>

<h2 class="section">Ma section</h2>
<p class="text">Contenu...</p>

<script>
window.registerSearchEntries([
  { title: 'Mon titre', page: 'mon-sujet', section: 'Ma section', content: 'mots-clés' },
]);
</script>
```

> ✅ Les `<script>` dans les fragments sont **automatiquement réexécutés** après injection
> grâce à `runPageScripts()` dans `index.html`. Pas besoin de toucher à `index.html`.

**Structure avec pleine largeur (pour les outils interactifs) :**
```html
<div data-fullwidth="true">

  <div class="page-hero">...</div>

  <!-- Styles locaux scopés -->
  <style>
    #mon-outil { ... }
  </style>

  <!-- HTML de l'outil -->
  <div id="mon-outil">...</div>

  <!-- JS autonome dans une IIFE -->
  <script>
  (function() {
    'use strict';
    // Tout le code ici
    // Les variables restent locales à la fonction (pas de pollution globale)

    window.registerSearchEntries([{ ... }]);
  })();
  </script>

</div>
```

> L'attribut `data-fullwidth="true"` sur l'élément racine active automatiquement
> la pleine largeur (`max-width: 100%`) pour cette page uniquement.

### Étape 2 — Ajouter à `nav.json`

```json
{
  "section": "Ma section",
  "items": [
    { "id": "mon-sujet", "icon": "🎮", "label": "Mon sujet" }
  ]
}
```

L'`id` doit correspondre exactement au nom du fichier **sans `.html`**.

### Étape 3 — Tester

```bash
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

### Alternative — Éditeur de navigation intégré

Cliquer sur **✏️ Nav** dans la sidebar → glisser-déposer pour réordonner, modifier les labels → **Appliquer** → télécharger le `nav.json` mis à jour.

---

## Supprimer une page

1. Supprimer `pages/mon-sujet.html`
2. Retirer l'entrée dans `nav.json`

Le cache mémoire est vidé automatiquement au rechargement.

---

## Modifier une page existante

Éditer directement `pages/NOM.html`. Le site charge chaque page à la demande avec un cache en mémoire — un rechargement de l'onglet (F5) suffit pour voir les changements.

---

## Comment fonctionne le moteur du site

| Fichier | Rôle |
|---------|------|
| `index.html` | Shell unique : CSS global, sidebar, topbar, moteur de navigation et de recherche |
| `nav.json` | Arbre de navigation — seule source de vérité pour les sections et pages |
| `pages/*.html` | Fragments HTML injectés à la demande dans `#page-container` |

**Flux de navigation :**
1. `navigateTo(pageId)` est appelé (clic nav, hash URL, ou code)
2. `loadPage(pageId)` fetche `pages/pageId.html` (ou le cache)
3. Le HTML est injecté dans `#page-container` via `innerHTML`
4. `runPageScripts()` réexécute tous les `<script>` du fragment
5. `applyPageLayout()` active la pleine largeur si `data-fullwidth="true"` est présent
6. `initPageScripts(pageId)` initialise les simulateurs inline existants (hierarchy, skills-flow)

---

## Classes CSS disponibles (dans toutes les pages)

| Classe | Usage |
|--------|-------|
| `.page-hero` | En-tête de page (h1 + lead + tags) |
| `h2.section` | Titre de section principal |
| `h3.subsection` | Sous-titre |
| `p.text` | Paragraphe standard |
| `ul.list` | Liste à puces stylée |
| `.callout .callout-or/vert/rouge/bleu/violet` | Bloc callout coloré |
| `.code-wrap` + `.code-header` + `pre` | Bloc de code avec bouton copier |
| `.table-wrap` + `table` | Tableau avec style automatique |
| `.cards .cards-2/.cards-3` + `.card` | Grille de cartes |
| `.simulator` + `.sim-controls/.sim-btn/.sim-output` | Simulateur interactif |
| `.sources` + `.source-list` + `.source-item` | Section de sources |
| `.tag .tag-or/vert/bleu/rouge/violet` | Badge tag coloré |
| `.layer-card .layer-c0/c1/c2/c3/c4` | Carte de couche architecturale |

## Fonctions globales JS (disponibles dans tous les fragments)

```javascript
window.navigateTo('page-id')           // Navigation entre pages
window.copyCode(btn)                    // Copie le bloc de code parent
window.registerSearchEntries([...])    // Enrichit l'index de recherche
```

## Variables CSS (palette complète)

```css
--or:#F2B749    --ocre:#A65526   --brun:#6B3A1F
--vert:#4A7C59  --rouge:#8B1A1A  --bleu:#2E5B8A  --violet:#6B3FA0
--noir:#0D0A07  --noir2:#1A1008  --noir3:#241508
--gris:#888888  --gris2:#444444  --blanc:#F5F0E8
--font-display:'Syne',sans-serif
--font-mono:'Space Mono',monospace
--font-body:'Inter',sans-serif
--radius:6px    --transition:0.18s ease   --sidebar-w:260px  --header-h:56px
```

---

## Mise en ligne — Options gratuites

### Option 1 — GitHub Pages ⭐ (recommandé)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TON_USER/dethroned-guide.git
git push -u origin main
# GitHub → Settings → Pages → Source : main → / (root)
# URL : https://TON_USER.github.io/dethroned-guide/
```

### Option 2 — Netlify Drop (le plus rapide)

1. Aller sur **https://app.netlify.com/drop**
2. Glisser-déposer le dossier → URL générée en 30 secondes

### Option 3 — Cloudflare Pages

1. **https://pages.cloudflare.com** → connecter le dépôt GitHub
2. Build command : *(vide)*, Output directory : `.`

### Option 4 — Vercel

```bash
npm install -g vercel && vercel
```

---

## Intégrer un nouvel outil avec Claude

Utilise le prompt disponible dans la page **Prompt d'intégration** du site (`pages/integration-prompt.html`).

Il couvre tous les cas : page de documentation simple, simulateur interactif, outil pleine largeur avec JS autonome.

---

*Bonaventure Studio · bonaventure.games · Godot 4.6+*
