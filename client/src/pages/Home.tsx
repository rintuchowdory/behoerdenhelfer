import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

/**
 * Design: Minimalistisches Vertrauens-Design
 * - Hero-Sektion mit Behördenblau und Vertrauens-Signalen
 * - Guilloché-Signaturhintergrund (index.css)
 * - Subtile Animationen und Hover-Effekte
 */

const NAV_ITEMS = [
  { label: "Checklisten", path: "/checklist-generator" },
  { label: "Dokumente", path: "/document-explainer" },
  { label: "Fristen", path: "/deadline-reminders" },
  { label: "Briefe", path: "/brief-generator" },
  { label: "Glossar", path: "/glossar" },
  { label: "Ämter", path: "/amts-finder" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      title: "Checklisten Generator",
      description:
        "Personalisierte Checklisten für Ihre Behördengänge. Schritt-für-Schritt Anleitung für Wohnanmeldung, Versicherungen, Steuern und mehr.",
      icon: CheckCircle2,
      path: "/checklist-generator",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Dokument Erklärer",
      description:
        "Komplexe deutsche Behördendokumente einfach erklärt. Wir übersetzen Behördendeutsch in verständliche Sprache.",
      icon: FileText,
      path: "/document-explainer",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Fristen Manager",
      description:
        "Verwalten Sie Ihre Behörden-Fristen und verpassen Sie keine Deadline mehr — mit Status-Tracking und Dringlichkeits-Anzeige.",
      icon: Clock,
      path: "/deadline-reminders",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Brief-Vorlagen",
      description:
        "Fertige Behördenbriefe: Widerspruch, Wohnungskündigung, Ratenzahlung und mehr — ausfüllen, kopieren, herunterladen.",
      icon: Mail,
      path: "/brief-generator",
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      title: "Amtsdeutsch-Glossar",
      description:
        "Endlich Klartext: Die wichtigsten Behördenbegriffe von „Bescheid“ bis „Wohnungsgeberbestätigung“ verständlich erklärt.",
      icon: BookOpen,
      path: "/glossar",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Amts-Finder",
      description:
        "Welche Behörde ist wofür zuständig? Bürgeramt, Ausländerbehörde, Finanzamt & Co. — mit Aufgaben, Unterlagen und Termin-Suche.",
      icon: Building2,
      path: "/amts-finder",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  const audiences = [
    { emoji: "🌍", label: "Expats", desc: "Für internationale Fachkräfte und Auswanderer" },
    { emoji: "🎓", label: "Studierende", desc: "Für Studierenden aus dem In- und Ausland" },
    { emoji: "💼", label: "Neue Arbeitskräfte", desc: "Für Berufsanfänger und Umzügler" },
  ];

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">§</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Behördenhelfer
              </h1>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-gray-700 hover:text-blue-700 transition-colors text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-transparent py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Deutsche Bürokratie
                  <span className="block text-blue-700">einfach gemacht</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Navigieren Sie mühelos durch deutsche Behördenprozesse. Wir helfen Ihnen mit
                  personalisierten Checklisten, verständlichen Erklärungen, fertigen Briefen
                  und automatischen Fristen-Erinnerungen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/checklist-generator")}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  Jetzt starten
                </Button>
                <Button
                  variant="outline"
                  onClick={scrollToFeatures}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Mehr erfahren
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Kostenlos & Datenschutz</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Läuft komplett lokal im Browser</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663511224854/Hieb3sfsz5eXqDVHfDSYSN/hero-bureaucracy-Fc4Q7XQTxrCdWRVUJk4xgL.webp"
                  alt="German Bureaucracy Helper"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sechs Werkzeuge, die Sie durch deutsche Behördenprozesse bringen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white"
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`${feature.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-700 font-medium text-sm hover:gap-2 transition-all">
                    Erkunden
                    <span className="ml-2">→</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-16 md:py-24 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Für wen ist das?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Der Behördenhelfer ist speziell für Menschen entwickelt, die neu in Deutschland sind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((audience, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-5xl mb-4">{audience.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {audience.label}
                </h3>
                <p className="text-gray-600">{audience.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-700 border-t border-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bereit, Ihre Behördengänge zu vereinfachen?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Beginnen Sie jetzt mit personalisierten Checklisten und automatischen Fristen-Erinnerungen
          </p>
          <Button
            onClick={() => navigate("/checklist-generator")}
            className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-all duration-200 hover:shadow-lg"
          >
            Jetzt kostenlos starten
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Behördenhelfer</h4>
              <p className="text-sm">
                Ihre Lösung für deutsche Behördenprozesse
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span>Keine Rechtsberatung — nur Orientierungshilfe</span>
                </li>
                <li>
                  <span>Daten bleiben lokal in Ihrem Browser</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Behördenhelfer. Alle Angaben ohne Gewähr.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
