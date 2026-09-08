import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, ExternalLink, Landmark, Search } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * Amts-Finder
 * - Welche Behörde ist wofür zuständig?
 * - Aufgaben, typische Anliegen und Unterlagen
 * - Offizielle Portale bzw. Termin-Suche
 */

interface Office {
  name: string;
  short?: string;
  category: "Wohnen & Alltag" | "Aufenthalt" | "Arbeit & Geld" | "Papierkram & Recht";
  responsible: string;
  tasks: string[];
  documents: string[];
  url?: string;      // offizielles Portal (bundesweit gültig)
  local?: boolean;   // Behörde gibt es in jeder Stadt → Termin dort buchen
}

const OFFICES: Office[] = [
  {
    name: "Bürgeramt / Einwohnermeldeamt",
    short: "Erster Anlaufpunkt",
    category: "Wohnen & Alltag",
    responsible:
      "Alles rund um Ihren Wohnsitz: Anmeldung, Ummeldung, Abmeldung, Meldebescheinigungen, Steuer-ID (Antrag auf Zweitbescheinigung), Vollmachten.",
    tasks: ["Anmeldung nach Umzug (innerhalb von 14 Tagen!)", "Abmeldung beim Auszug", "Meldebescheinigung / Haushaltsbescheinigung", "Beglaubigung von Kopien"],
    documents: ["Personalausweis oder Reisepass", "Wohnungsgeberbestätigung vom Vermieter", "Mietvertrag (falls vorhanden)", "Anmeldeformular (vor Ort oder online)"],
    local: true,
  },
  {
    name: "Ausländerbehörde (ABH)",
    short: "Aufenthaltstitel",
    category: "Aufenthalt",
    responsible:
      "Aufenthaltstitel für Nicht-EU-Bürger: Visa, Aufenthaltserlaubnis, Verlängerungen, Niederlassungserlaubnis, Arbeitsgenehmigungen, Fiktionsbescheinigungen.",
    tasks: ["Erstantrag Aufenthaltserlaubnis", "Verlängerung vor Ablauf (6–8 Wochen vorher!)", "Wechsel des Aufenthaltszwecks", "Fiktionsbescheinigung bei Terminnot"],
    documents: ["Reisepass", "Aktueller Aufenthaltstitel", "Mietvertrag + Meldebescheinigung", "Nachweis Einkommen / Arbeitsvertrag", "Biometrisches Foto"],
    local: true,
  },
  {
    name: "Finanzamt",
    short: "Steuern",
    category: "Arbeit & Geld",
    responsible:
      "Ihr steuerliches Zuhause: Steuernummer, Steuererklärung, Freibeträge, Kirchensteuer, Gewerbe- und Einkommensteuer.",
    tasks: ["Steuernummer beantragen (automatisch nach Erstanmeldung)", "Steuererklärung abgeben (via ELSTER)", "Freibeträge eintragen lassen", "Bescheide & Korrekturen"],
    documents: ["Steuer-ID", "Lohnsteuerbescheinigung", "Belege für Werbungskosten", "ELSTER-Zertifikat"],
    url: "https://www.elster.de",
    local: true,
  },
  {
    name: "Agentur für Arbeit",
    short: "Jobs & Arbeitslosengeld",
    category: "Arbeit & Geld",
    responsible:
      "Arbeitsvermittlung, Arbeitslosengeld I, Weiterbildung, Beratung zu Arbeitsmarkt und Bewerbungen.",
    tasks: ["Arbeitslos melden (innerhalb von 3 Monaten nach Jobende!)", "Arbeitslosengeld I beantragen", "Weiterbildung / Bildungsgutschein", "Berufsberatung"],
    documents: ["Personalausweis", "Sozialversicherungsnummer", "Kündigungsschreiben / Arbeitsbescheinigung", "Lebenslauf"],
    url: "https://www.arbeitsagentur.de",
    local: true,
  },
  {
    name: "Jobcenter",
    short: "Bürgergeld",
    category: "Arbeit & Geld",
    responsible:
      "Leistungen zur Sicherung des Lebensunterhalts (Bürgergeld, früher „Hartz IV“), inklusive Krankenversicherung und Wohnungskosten.",
    tasks: ["Bürgergeld beantragen", "Kosten der Unterkunft (Miete) übernehmen lassen", "Eingliederungsvereinbarung"],
    documents: ["Personalausweis", "Mietvertrag + letzte Mietabrechnung", "Kontoauszüge der letzten 3 Monate", "Nachweise über Einkommen und Vermögen"],
    url: "https://www.arbeitsagentur.de/jobs/und-arbeit/jobcenter",
    local: true,
  },
  {
    name: "Krankenkasse (gesetzliche)",
    short: "Gesundheit",
    category: "Wohnen & Alltag",
    responsible:
      "Pflichtversicherung für Arbeitnehmer: Mitgliedschaft, eAU (elektronische Arbeitsunfähigkeitsbescheinigung), Familienversicherung, Erstattungen.",
    tasks: ["Mitgliedschaft bescheinigen (für Arbeitgeber/ABH)", "Krankmeldung (läuft heute elektronisch über die Praxis)", "Zusatzleistungen beantragen", "Mitgliedsbescheinigung für Behörden"],
    documents: ["Personalausweis", "Sozialversicherungsnummer (falls vorhanden)", "Anmeldebestätigung"],
    local: true,
  },
  {
    name: "Gewerbeamt",
    short: "Selbstständigkeit",
    category: "Papierkram & Recht",
    responsible:
      "An- und Abmeldung eines Gewerbes, Gewerbeschein, Nebentätigkeiten. Freiberufler (Ärzte, Journalisten, Ingenieure …) brauchen kein Gewerbe — sie melden sich direkt beim Finanzamt.",
    tasks: ["Gewerbe anmelden (bei Start der Tätigkeit)", "Gewerbe abmelden", "Gewerbeschein kopieren/beantragen"],
    documents: ["Personalausweis/Reisepass", "ggf. Aufenthaltstitel (Selbstständigkeit erlaubt?)", "Handelsregisterauszug (bei GmbH/UG)"],
    local: true,
  },
  {
    name: "Standesamt",
    short: "Urkunden",
    category: "Papierkram & Recht",
    responsible:
      "Geburts-, Ehe- und Sterbeurkunden, Eheschließung, Namensänderung, Vaterschaftsanerkennung.",
    tasks: ["Geburtsurkunde (mit Angabe der Eltern — für Ehe/Ausländerbehörde)", "Eheurkunde / Familienstammbuch", "Namensbescheinigung"],
    documents: ["Personalausweis", "beglaubigte Übersetzungen ausländischer Urkunden", "ggf. Apostille"],
    local: true,
  },
  {
    name: "Führerscheinstelle",
    short: "Führerschein",
    category: "Papierkram & Recht",
    responsible:
      "Ersterteilung, Umtausch ausländischer Führerscheine, Umschreibung internationaler Scheine, Entziehung und Neuerteilung.",
    tasks: ["Umtausch eines EU-Führerscheins", "Umschreibung ausländischer Führerschein (bei Wohnsitz Deutschland) ", "Internationaler Führerschein"],
    documents: ["Personalausweis", "Führerschein", "Biometrisches Foto", "Sehtest (Ersterteilung)"],
    local: true,
  },
  {
    name: "Bundesamt für Justiz",
    short: "Führungszeugnis online",
    category: "Papierkram & Recht",
    responsible:
      "Bundesbehörde für Verwaltungsangelegenheiten der Justiz — vor allem: das Führungszeugnis (Beantragung komplett online möglich).",
    tasks: ["Führungszeugnis beantragen (einfach/erweitert)", "Beglaubigungen (Apostille) für Bundesbehörden"],
    documents: ["Personalausweis", "Reisepass"],
    url: "https://www.bundesjustizamt.de",
  },
  {
    name: "Deutsche Rentenversicherung",
    short: "Rente & Kontenklärung",
    category: "Arbeit & Geld",
    responsible:
      "Rentenversicherungspflicht, Rentenpunkte, Kontenklärung (wichtig für Auslandsjahre!), Erwerbsminderungsrente, Beratung.",
    tasks: ["Rentenkontenklärung (Renteninformation prüfen)", "Versicherungsverlauf anfordern", "Beratungstermin (kostenlos, auch für Ausländerjahre)"],
    documents: ["Sozialversicherungsnummer", "Personalausweis", "Arbeitsverträge / Nachweise über Auslandsbeschäftigung"],
    url: "https://www.deutsche-rentenversicherung.de",
    local: true,
  },
  {
    name: "Beitragsservice (Rundfunk)",
    short: "Rundfunkbeitrag",
    category: "Wohnen & Alltag",
    responsible:
      "Staatliche Mitteilungsstelle des öffentlich-rechtlichen Rundfunks — Anmeldung der Wohnung, Befreiungen, Ermäßigungen.",
    tasks: ["Wohnung anmelden (innerhalb eines Monats nach Einzug)", "Befreiung/ERM\u00d6\u00dfigung beantragen (BAf\u00f6G, B\u00fcrgergeld \u2026)", "Beitragsnummer besorgen (f\u00fcr Ausl\u00e4nderbeh\u00f6rde & Banken)"],
    documents: ["Anmeldebescheinigung", "Nachweis f\u00fcr Befreiung (z. B. BAf\u00f6G-Bescheid)"],
    local: true,
  },
];

const CATEGORIES = ["Alle", "Wohnen & Alltag", "Aufenthalt", "Arbeit & Geld", "Papierkram & Recht"] as const;

export default function AmtsFinder() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Alle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OFFICES.filter((office) => {
      const matchesCategory =
        category === "Alle" || office.category === category;
      const matchesQuery =
        q === "" ||
        office.name.toLowerCase().includes(q) ||
        office.responsible.toLowerCase().includes(q) ||
        office.tasks.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Zurück zur Startseite"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Amts-Finder</h1>
          </div>
          <p className="text-gray-600">
            Welche Behörde ist wofür zuständig — mit Aufgaben, Unterlagen und Termin-Suche
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchen, z. B. „Aufenthaltstitel“ oder „Führerschein“…"
              className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  cat === category
                    ? "bg-blue-700 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center border border-gray-200 bg-white">
            <Landmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Keine Behörde gefunden.</p>
            <p className="text-sm text-gray-400 mt-1">
              Versuchen Sie einen anderen Suchbegriff oder wählen Sie „Alle“.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((office) => (
              <Card
                key={office.name}
                className="p-6 border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg shrink-0">
                    <Landmark className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">
                        {office.name}
                      </h3>
                      {office.short && (
                        <span className="inline-block px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded font-medium">
                          {office.short}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mt-2">
                      {office.responsible}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      Typische Anliegen
                    </p>
                    <ul className="space-y-1">
                      {office.tasks.map((task) => (
                        <li key={task} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-700 mt-0.5">•</span> {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      Häufig mitbringen
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {office.documents.map((doc) => (
                        <span
                          key={doc}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {office.url && (
                    <a
                      href={office.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-blue-700 text-blue-700 px-3 py-1.5 text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      Offizielles Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      office.name + " Termin in Ihrer Stadt"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 text-gray-700 px-3 py-1.5 text-sm font-medium hover:border-blue-700 hover:text-blue-700 transition-colors"
                  >
                    Termin in Ihrer Stadt finden <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-gray-400 text-center">
          Öffnungszeiten, Zuständigkeiten und Gebühren variieren je nach Stadt und Bundesland —
          prüfen Sie vor dem Besuch immer die Website Ihrer örtlichen Behörde.
        </p>
      </div>
    </div>
  );
}
