# Behördenhelfer

Ein modernes Web-Anwendung, die Expats, Studierenden und neuen Arbeitnehmern hilft, deutsche Behördenprozesse zu navigieren.

## 🎯 Features

### 1. **Checklisten Generator**
Personalisierte Checklisten für häufige Behördengänge:
- Wohnanmeldung (Meldeschein)
- Versicherungen (Krankenversicherung, Haftpflicht)
- Steuern & Finanzen (Steuernummer, Bankkonto)
- Schritt-für-Schritt Anleitung
- Fortschrittsanzeige
- Download als Textdatei

### 2. **Dokument Erklärer**
Komplexe deutsche Behördendokumente einfach erklärt:
- Meldeschein (Wohnanmeldung)
- Arbeitsvertrag
- Mietvertrag
- Detaillierte Erklärungen für jeden Abschnitt
- Wichtigkeits-Indikatoren (Sehr wichtig / Wichtig / Informativ)
- Upload eigener Dokumente (geplant)

### 3. **Fristen Manager**
Automatische Verwaltung von Behörden-Fristen:
- Farbcodierte Dringlichkeit
- Automatische Erinnerungen
- Kalender-Ansicht
- Filterung nach Status
- Statistiken (Gesamt, Dringend, Erledigt)

## 🎨 Design

Das Projekt folgt einem **minimalistischen Vertrauens-Design**:
- **Primärfarbe**: Behördenblau (#1E40AF) - signalisiert Vertrauen und Professionalität
- **Typografie**: Playfair Display für Überschriften (Autorität), Inter für Body-Text (Lesbarkeit)
- **Layout**: Asymmetrisches Design mit klarer Navigation
- **Animationen**: Subtile, schnelle Übergänge (150-200ms)

## 🚀 Technologie Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: Wouter
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm run dev

# Für Produktion bauen
GITHUB_PAGES=true pnpm run build

# TypeScript prüfen
pnpm run check

# Code formatieren
pnpm run format
```

## 🔄 CI/CD Pipeline

Das Projekt verwendet GitHub Actions für automatisierte Tests und Deployment:

### Workflows

1. **deploy.yml** - Build und Deployment zu GitHub Pages
   - Wird bei jedem Push zu `main` ausgelöst
   - Führt TypeScript-Checks durch
   - Baut die Anwendung
   - Deployed zu GitHub Pages

2. **quality.yml** - Code-Qualitätsprüfungen
   - ESLint für Code-Stil
   - TypeScript Type-Checking
   - Formatierungsprüfungen

## 📝 Projektstruktur

```
.
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Startseite
│   │   │   ├── ChecklistGenerator.tsx   # Checklisten-Feature
│   │   │   ├── DocumentExplainer.tsx    # Dokument-Erklärer
│   │   │   └── DeadlineReminders.tsx    # Fristen-Manager
│   │   ├── components/
│   │   │   └── ui/                      # shadcn/ui Komponenten
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx         # Theme Management
│   │   ├── App.tsx                      # Routing & Layout
│   │   ├── main.tsx                     # Entry Point
│   │   └── index.css                    # Global Styles
│   ├── index.html                       # HTML Template
│   └── public/                          # Static Assets
├── .github/
│   └── workflows/
│       ├── deploy.yml                   # GitHub Pages Deployment
│       └── quality.yml                  # Code Quality Checks
├── vite.config.ts                       # Vite Konfiguration
├── tailwind.config.js                   # Tailwind Konfiguration
├── tsconfig.json                        # TypeScript Konfiguration
└── package.json                         # Dependencies

```

## 🌐 Deployment

Die Anwendung wird automatisch zu GitHub Pages deployed:

```
https://rintu-chowdory.github.io/behoerdenhelfer/
```

### Deployment-Prozess

1. Code wird zu `main` gepusht
2. GitHub Actions startet automatisch
3. Dependencies werden installiert
4. TypeScript-Checks werden durchgeführt
5. Anwendung wird gebaut (mit `GITHUB_PAGES=true`)
6. Build-Artefakte werden zu GitHub Pages uploaded
7. Website ist live verfügbar

## 🔧 Konfiguration

### Umgebungsvariablen

Für GitHub Pages Deployment:
```bash
GITHUB_PAGES=true    # Setzt base path zu /behoerdenhelfer/
```

### Vite Konfiguration

Die `vite.config.ts` ist konfiguriert für:
- GitHub Pages mit korrektem Base Path
- TypeScript Support
- Tailwind CSS Integration
- React Fast Refresh
- Debug Logging für Entwicklung

## 📱 Browser-Unterstützung

- Chrome/Chromium (neueste)
- Firefox (neueste)
- Safari (neueste)
- Edge (neueste)

## 🤝 Beitragen

Beiträge sind willkommen! Bitte:

1. Erstellen Sie einen Feature Branch
2. Machen Sie Ihre Änderungen
3. Führen Sie `pnpm run check` aus
4. Erstellen Sie einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details

## 📞 Support

Haben Sie Fragen oder Probleme? Erstellen Sie ein Issue im Repository.

---

**Entwickelt mit ❤️ für Expats, Studierende und neue Arbeitskräfte in Deutschland**
