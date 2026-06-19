# Behördenhelfer - Digitaler Assistent für deutsche Bürokratie

Ein produktionsreifes Projekt, das eine moderne React-Anwendung mit umfassender CI/CD-Automatisierung, Containerisierung und Kubernetes-Deployment-Funktionen bietet.

## 🎯 Projekt-Übersicht

Dieses Projekt demonstriert erstklassige DevOps-Praktiken, einschließlich automatisierter Tests, Code-Qualitätsprüfungen, Docker-Containerisierung, mehrstufiger CI/CD-Pipelines und Kubernetes-Orchestrierung. Die Anwendung wurde mit React 19, Vite 7, TypeScript und Tailwind CSS erstellt.

## ✨ Hauptmerkmale

### Moderner Tech-Stack
- **React 19** - Neuestes React mit verbesserter Performance
- **Vite 7** - Blitzschnelles Build-Tool mit HMR
- **TypeScript** - Volle Typsicherheit in der gesamten Codebasis
- **Tailwind CSS 4** - Utility-first CSS-Framework
- **Lucide React** - Schöne Icon-Bibliothek

### Entwicklungserfahrung
- **ESLint** - Durchsetzung von Codequalität und Stil
- **Prettier** - Automatische Codeformatierung
- **Vitest** - Schnelles Unit-Testing-Framework
- **TypeScript** - Strikte Typprüfung
- **Pfad-Aliase** - Saubere Importpfade mit `@/` Präfix

### CI/CD Pipeline
- **GitHub Actions** - Automatisiertes Testen, Linting und Building
- **Multi-stage Builds** - Optimierte Docker-Images
- **Sicherheits-Scanning** - CodeQL-Analyse und Abhängigkeits-Audits
- **Automatisierte Deployments** - Staging- und Produktionsumgebungen
- **Dependabot** - Automatisierte Abhängigkeits-Updates

### DevOps & Infrastruktur
- **Docker** - Mehrstufige Builds mit Sicherheits-Best-Practices
- **Docker Compose** - Lokale Entwicklungsumgebung
- **Kubernetes** - Produktions-Deployment-Manifeste
- **Nginx** - Reverse Proxy mit Sicherheits-Headern
- **Health Checks** - Überwachung der Container- und Pod-Gesundheit

## 📋 Voraussetzungen

Stellen Sie sicher, dass Sie Folgendes installiert haben:

| Tool | Version | Zweck |
|------|---------|---------|
| Node.js | ≥18.0.0 | JavaScript-Laufzeit |
| pnpm | ≥9.0.0 | Paketmanager |
| Docker | ≥20.10 | Container-Laufzeit |
| Docker Compose | ≥2.0 | Multi-Container-Orchestrierung |
| kubectl | ≥1.24 | Kubernetes CLI (optional) |

## 🚀 Schnellstart

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/Rintu-chowdory/behoerdenhelfer.git
cd behoerdenhelfer

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm run dev

# Browser unter http://localhost:3000 öffnen
```

### Entwicklungs-Befehle

| Befehl | Beschreibung |
|---------|-------------|
| `pnpm run dev` | Entwicklungsserver mit HMR starten |
| `pnpm run build` | Produktions-Build erstellen |
| `pnpm run preview` | Lokale Vorschau des Produktions-Builds |
| `pnpm run lint` | ESLint-Prüfungen ausführen |
| `pnpm run format` | Code mit Prettier formatieren |
| `pnpm run test` | Unit-Tests mit Vitest ausführen |
| `pnpm run type-check` | TypeScript-Typen prüfen |

## 📁 Projektstruktur

```
behoerdenhelfer/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml              # Haupt-CI/CD-Pipeline
│       ├── codeql.yml             # Sicherheits-Scanning
│       └── dependabot.yml         # Abhängigkeits-Updates
├── k8s/
│   ├── deployment.yaml            # Kubernetes Deployment
│   ├── service.yaml               # Kubernetes Service
│   ├── configmap.yaml             # Konfigurationsmanagement
│   └── hpa.yaml                   # Horizontal Pod Autoscaler
├── client/
│   ├── src/
│   │   ├── components/            # React Komponenten
│   │   ├── pages/                 # Seiten-Komponenten
│   │   ├── App.tsx                # Haupt-App-Komponente
│   │   ├── main.tsx               # React Einstiegspunkt
│   │   └── index.css              # Globale Stile
├── Dockerfile                     # Mehrstufiger Docker Build
├── docker-compose.yml             # Lokale Entwicklungsumgebung
├── nginx.conf                     # Nginx Konfiguration
├── vite.config.ts                 # Vite Konfiguration
├── tsconfig.json                  # TypeScript Konfiguration
├── package.json                   # Abhängigkeiten & Skripte
└── README.md                      # Diese Datei
```

## ☸️ Kubernetes Deployment

### Voraussetzungen
```bash
# Namespace erstellen (optional)
kubectl create namespace behoerdenhelfer

# ConfigMap anwenden
kubectl apply -f k8s/configmap.yaml

# Deployment anwenden
kubectl apply -f k8s/deployment.yaml

# Service anwenden
kubectl apply -f k8s/service.yaml

# HPA anwenden
kubectl apply -f k8s/hpa.yaml
```

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die LICENSE-Datei für Details.

## 👤 Autor

**Rintu Chowdory**
- GitHub: [@Rintu-chowdory](https://github.com/Rintu-chowdory)

---

**Zuletzt aktualisiert:** Juni 20, 2026  
**Status:** Produktionsbereit ✅
