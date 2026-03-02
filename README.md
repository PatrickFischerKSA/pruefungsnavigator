# Prüfungsnavigator – Future Skills Lab

> **KI-gestützter Autopilot für die Prüfungsvorbereitung an der Fachmittelschule (FMS Pädagogik)**

Ein vollständig statisches React-Frontend, das 17-jährige Schüler\*innen in Zweiergruppen durch eine strukturierte, KI-gestützte Prüfungsvorbereitung führt. Alle integrierten Tools sind **100 % kostenlos** und erfordern **kein Abo**.

---

## Inhalt

- [Über das Projekt](#über-das-projekt)
- [Die 5 Phasen](#die-5-phasen)
- [Integrierte Tools](#integrierte-tools)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Deployment auf GitHub Pages](#deployment-auf-github-pages)
- [Deployment auf Netlify / Vercel](#deployment-auf-netlify--vercel)
- [Projektstruktur](#projektstruktur)

---

## Über das Projekt

Der **Prüfungsnavigator** ist eine interaktive Lernlandschaft für Schüler\*innen der Fachmittelschule (pädagogisches Profil). Er kombiniert:

- **Upload-Funktion** für Unterrichtsunterlagen und Modellprüfungen
- **KI-gestützte Analyse** mit NotebookLM, ChatGPT und Fobizz
- **Probeprüfungs-Generator** mit interaktivem Demo-Quiz
- **Lernstrategien** (Feynman, Retrieval Practice, Spacing, Wenn-Dann-Planung)
- **Reflexions- und Feedback-Modul** mit digitalem Lernjournal
- **Lehrperson-Ansicht** zum Mitlesen und Kommentieren

---

## Die 5 Phasen

| Phase | Titel | Dauer | Kerntools |
|-------|-------|-------|-----------|
| 1 | Unterlagen hochladen | 10–15 Min. | NotebookLM, Google Drive |
| 2 | KI-gestützte Analyse | 20–30 Min. | NotebookLM, ChatGPT, Fobizz |
| 3 | Probeprüfung generieren | 30–45 Min. | ChatGPT, Quizlet, Revisely |
| 4 | Lernstrategien | 15–20 Min. | Excalidraw, CryptPad, Quizlet |
| 5 | Reflexion & Feedback | 15–20 Min. | CryptPad, ChatGPT |

---

## Integrierte Tools

Alle Tools sind kostenlos nutzbar (kein Abo erforderlich):

| Tool | Zweck | Konto nötig? |
|------|-------|--------------|
| [Google NotebookLM](https://notebooklm.google.com) | Dokument-Analyse, Zusammenfassungen | Google-Konto |
| [ChatGPT](https://chat.openai.com) | Probeprüfungen, Erklärungen, Feedback | Optional |
| [Fobizz](https://app.fobizz.com) | DSGVO-konformer KI-Chatbot, Arbeitsblätter | Ja (kostenlos) |
| [CryptPad](https://cryptpad.fr) | Kollaboratives Schreiben, Lernjournal | Nein |
| [Excalidraw](https://excalidraw.com) | Mindmaps, Skizzen | Nein |
| [Quizlet](https://quizlet.com) | Lernkarten, Spaced Repetition | Optional |
| [Revisely](https://www.revisely.com/quiz-generator) | KI-Quiz aus PDF/Text | Nein |
| [Mentimeter](https://www.mentimeter.com) | Live-Quiz | Ja (kostenlos) |
| [Kahoot!](https://kahoot.com) | Spielbasiertes Quiz | Ja (kostenlos) |
| [Miro](https://miro.com) | Kollaboratives Whiteboard | Ja (kostenlos) |

---

## Lokale Entwicklung

### Voraussetzungen

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 8

### Installation

```bash
# Repository klonen
git clone https://github.com/DEIN-USERNAME/pruefungsnavigator.git
cd pruefungsnavigator

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm dev
```

Die App ist dann unter `http://localhost:3000` erreichbar.

### Build erstellen

```bash
pnpm build
```

Der Build-Output liegt in `dist/public/`.

---

## Deployment auf GitHub Pages

### Methode 1: GitHub Actions (empfohlen)

1. Forke dieses Repository auf GitHub
2. Erstelle die Datei `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

3. Gehe zu **Settings → Pages** und wähle `gh-pages` als Branch
4. Die App ist nach wenigen Minuten unter `https://DEIN-USERNAME.github.io/pruefungsnavigator/` erreichbar

> **Wichtig:** Füge in `vite.config.ts` den `base`-Pfad hinzu:
> ```ts
> export default defineConfig({
>   base: '/pruefungsnavigator/',
>   // ...
> })
> ```

### Methode 2: Manuell

```bash
pnpm build
# Inhalt von dist/public/ in den gh-pages Branch pushen
```

---

## Deployment auf Netlify / Vercel

### Netlify

1. Verbinde dein GitHub-Repository mit [Netlify](https://netlify.com)
2. Build-Einstellungen:
   - **Build command:** `pnpm build`
   - **Publish directory:** `dist/public`
3. Klicke auf "Deploy"

### Vercel

1. Importiere dein Repository auf [Vercel](https://vercel.com)
2. Framework: **Vite**
3. Build command: `pnpm build`
4. Output directory: `dist/public`

---

## Projektstruktur

```
pruefungsnavigator/
├── client/
│   ├── index.html              # HTML-Einstiegspunkt
│   └── src/
│       ├── App.tsx             # Routing
│       ├── index.css           # Globales CSS (Design-System)
│       ├── components/
│       │   └── Layout.tsx      # Sidebar-Navigation
│       └── pages/
│           ├── Home.tsx        # Dashboard
│           ├── Phase1Upload.tsx    # Phase 1: Upload
│           ├── Phase2KI.tsx        # Phase 2: KI-Analyse
│           ├── Phase3Quiz.tsx      # Phase 3: Probeprüfung
│           ├── Phase4Strategien.tsx # Phase 4: Lernstrategien
│           ├── Phase5Reflexion.tsx  # Phase 5: Reflexion
│           └── LehrerView.tsx      # Lehrperson-Ansicht
├── server/                     # Placeholder (statisches Projekt)
├── shared/                     # Placeholder
├── package.json
├── vite.config.ts
└── README.md
```

---

## Pädagogischer Hintergrund

Dieses Projekt basiert auf wissenschaftlich belegten Lernstrategien aus dem **Selbstlernheft Lernstrategien** (FMS):

- **Retrieval Practice** (aktives Abrufen): Wissen ohne Hilfsmittel erinnern
- **Spacing Effect** (verteiltes Lernen): Mehrere kurze Sessions > eine lange
- **Feynman-Methode**: Erklären als Verständnistest
- **Wenn-Dann-Planung**: Konkrete Motivationspläne gegen Prokrastination
- **Selbstbestimmungstheorie** (Deci & Ryan): Autonomie, Kompetenz, Zugehörigkeit

### Überfachliche Kompetenzen (FMS Pädagogik)

Der Navigator fördert folgende überfachliche Kompetenzen:

| Kompetenz | Umsetzung im Navigator |
|-----------|------------------------|
| Selbstorganisation | Eigenständige Planung durch alle 5 Phasen |
| Medienkompetenz | Kritischer Umgang mit KI-Tools |
| Kollaboration | Zweiergruppen-Struktur, Peer-Feedback |
| Reflexionsfähigkeit | Lernjournal, Fünf-Finger-Feedback |
| Lernstrategien | Explizite Methoden-Auswahl in Phase 4 |

---

## Lizenz

MIT License – frei verwendbar für Bildungszwecke.

---

*Erstellt mit React 19 + Tailwind CSS 4 + Vite*
