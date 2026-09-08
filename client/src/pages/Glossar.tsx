import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * Amtsdeutsch-Glossar
 * - Behördendeutsch in Klartext
 * - Suchbar, mit Kategorie-Filter und Praxistipps
 */

interface GlossaryEntry {
  term: string;
  category: "Wohnen" | "Steuern & Finanzen" | "Aufenthalt" | "Papierkram" | "Recht & Fristen";
  plain: string;
  tip?: string;
}

const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Bescheid",
    category: "Recht & Fristen",
    plain:
      "Die offizielle schriftliche Antwort einer Behörde auf Ihren Antrag. Ein Bescheid ist rechtskräftig, wenn Sie nicht widersprechen.",
    tip: "Prüfen Sie immer das Datum — Widerspruchsfristen laufen ab dem Moment, in dem der Bescheid Ihnen bekanntgegeben wurde.",
  },
  {
    term: "Widerspruch",
    category: "Recht & Fristen",
    plain:
      "Ihr förmlicher Einspruch gegen einen Bescheid. Damit sagen Sie: „Ich bin mit der Entscheidung nicht einverstanden.“",
    tip: "Meistens müssen Sie innerhalb von 1 Monat widersprechen. Das Schreiben muss Name, Aktenzeichen und Datum des Bescheids enthalten.",
  },
  {
    term: "Verwaltungsakt",
    category: "Recht & Fristen",
    plain:
      "Beamtendeutsch für eine einzelne behördliche Entscheidung — ein Bescheid ist also ein Verwaltungsakt.",
  },
  {
    term: "Zustellung",
    category: "Recht & Fristen",
    plain:
      "Die offizielle Übermittlung eines Dokuments an Sie — z. B. per Post mit Empfangsbestätigung oder durch Einwurf in den Briefkasten.",
    tip: "Ein Einschreiben mit Rückschein beweist, dass Sie etwas bekommen haben. Fristen beginnen oft mit der Zustellung.",
  },
  {
    term: "Anmeldung (Wohnsitz)",
    category: "Wohnen",
    plain:
      "Nach einem Umzug müssen Sie sich innerhalb von 14 Tagen beim Bürgeramt anmelden. Sonst droht ein Bußgeld.",
    tip: "Bringen Sie mit: Personalausweis/Reisepass, Wohnungsgeberbestätigung und — falls vorhanden — Mietvertrag.",
  },
  {
    term: "Ummeldung",
    category: "Wohnen",
    plain:
      "Dasselbe wie Anmeldung, nur wenn Sie innerhalb derselben Stadt umziehen. Bei Umzug in eine andere Stadt heißt es „Anmeldung“.",
  },
  {
    term: "Wohnungsgeberbestätigung",
    category: "Wohnen",
    plain:
      "Ein Formular, das Ihr Vermieter ausfüllt und unterschreibt. Es bestätigt, dass Sie in die Wohnung eingezogen sind. Ohne diese Bestätigung nimmt das Bürgeramt Ihre Anmeldung nicht an.",
  },
  {
    term: "Meldebescheinigung",
    category: "Wohnen",
    plain:
      "Der amtliche Nachweis, wo Sie gemeldet sind. Kostet meist 5–10 € und braucht man z. B. für die Bank oder die Ausländerbehörde.",
  },
  {
    term: "Kaution",
    category: "Wohnen",
    plain:
      "Die Sicherheitsleistung an Ihren Vermieter — maximal 3 Monatsmieten (ohne Nebenkosten). Sie muss verzinst werden und bekommen Sie am Auszug zurück.",
  },
  {
    term: "Nebenkostenabrechnung",
    category: "Wohnen",
    plain:
      "Die jährliche Abrechnung Ihrer Vorauszahlungen für Heizung, Wasser, Müll etc. Muss Ihnen spätestens 12 Monate nach Jahresende vorliegen.",
    tip: "Später als 12 Monate? Dann müssen Sie nichts mehr nachzahlen — das nennt man „Ausschlussfrist“.",
  },
  {
    term: "Betriebskosten",
    category: "Wohnen",
    plain: "Beamtendeutsch (und Vermieterdeutsch) für Nebenkosten.",
  },
  {
    term: "Steuer-ID (Steueridentifikationsnummer)",
    category: "Steuern & Finanzen",
    plain:
      "Ihre lebenslange 11-stellige Steuernummer. Sie bekommen sie automatisch mit der ersten Anmeldung — prüfen Sie Ihre Post vom Bundeszentralamt für Steuern.",
  },
  {
    term: "Steuernummer",
    category: "Steuern & Finanzen",
    plain:
      "Die Nummer Ihres örtlichen Finanzamts, unter der Ihre Akte läuft. Sie ist zuständig für die Steuererklärung, Gewerbe und Freibeträge.",
    tip: "Steuer-ID und Steuernummer sind zwei verschiedene Nummern — für die Steuererklärung via ELSTER brauchen Sie beide.",
  },
  {
    term: "ELSTER",
    category: "Steuern & Finanzen",
    plain:
      "Das Online-Portal der deutschen Steuerverwaltung (www.elster.de). Hier reichen Sie Steuererklärungen elektronisch ein.",
  },
  {
    term: "Freibeträge",
    category: "Steuern & Finanzen",
    plain:
      "Beträge, die vom zu versteuernden Einkommen abgezogen werden — z. B. für Pendler, Kinder oder außergewöhnliche Belastungen.",
  },
  {
    term: "Sozialversicherungsnummer",
    category: "Steuern & Finanzen",
    plain:
      "Ihre Nummer für Renten-, Kranken-, Arbeitslosen- und Pflegeversicherung. Sie steht auf Ihrer Lohnabrechnung oder im Sozialversicherungsausweis.",
    tip: "Arbeitgeber fragen nach der Nummer gleich am Anfang — schauen Sie auf frühere Gehaltsabrechnungen oder fragen Sie die Krankenkasse.",
  },
  {
    term: "Rundfunkbeitrag",
    category: "Steuern & Finanzen",
    plain:
      "Die Pflichtabgabe für öffentlich-rechtliches Fernsehen und Radio — aktuell 18,36 € pro Monat je Wohnung, unabhängig davon, ob Sie fernsehen.",
    tip: "Unter bestimmten Voraussetzungen (z. B. BAföG, Bürgergeld) können Sie Befreiung oder Ermäßigung beantragen.",
  },
  {
    term: "Aufenthaltstitel",
    category: "Aufenthalt",
    plain:
      "Der Oberbegriff für Visa und Aufenthaltserlaubnisse. Er steht in Ihrem Pass oder auf einem separaten Karten-Dokument.",
  },
  {
    term: "Aufenthaltserlaubnis",
    category: "Aufenthalt",
    plain:
      "Die befristete Erlaubnis, in Deutschland zu leben und zu arbeiten — z. B. zum Studium, für eine Arbeitsstelle oder Familiennachzug.",
    tip: "Beantragen Sie die Verlängerung früh — mindestens 6–8 Wochen vor Ablauf. Termine bei der Ausländerbehörde sind oft rar.",
  },
  {
    term: "Niederlassungserlaubnis",
    category: "Aufenthalt",
    plain:
      "Die unbefristete Aufenthaltserlaubnis. Voraussetzung sind meist 5 Jahre Aufenthalt, gesichertes Einkommen und Sprachkenntnisse.",
  },
  {
    term: "Fiktionsbescheinigung",
    category: "Aufenthalt",
    plain:
      "Eine vorläufige Bestätigung, dass Ihr Aufenthalt weiter gilt, während die Ausländerbehörde über Ihre Verlängerung entscheidet.",
    tip: "Wenn Ihre Aufenthaltserlaubnis bald abläuft, der Termin aber erst später kommt: Fiktionsbescheinigung ausstellen lassen — damit bleiben Sie legal.",
  },
  {
    term: "Verlängerungsantrag",
    category: "Aufenthalt",
    plain:
      "Der Antrag, Ihren ablaufenden Aufenthaltstitel zu verlängern. Wird bei der Ausländerbehörde gestellt, meist mit Termin.",
  },
  {
    term: "Vollmacht",
    category: "Papierkram",
    plain:
      "Ein Dokument, mit dem Sie einer anderen Person erlauben, in Ihrem Namen Behördenangelegenheiten zu erledigen.",
    tip: "Viele Ämter akzeptieren eine einfache schriftliche Vollmacht mit Datum und Unterschrift — manche verlangen ein eigenes Formular.",
  },
  {
    term: "Beglaubigung",
    category: "Papierkram",
    plain:
      "Die amtliche Bestätigung, dass eine Kopie mit dem Original übereinstimmt. Gibt es beim Bürgeramt (kostenpflichtig) oder kostenlos bei Ihrer Bank.",
  },
  {
    term: "Apostille",
    category: "Papierkram",
    plain:
      "Eine internationale Beglaubigung für ausländische Dokumente — z. B. wenn ein deutsches Dokument im Ausland anerkannt werden soll.",
  },
  {
    term: "Führungszeugnis",
    category: "Papierkram",
    plain:
      "Die amtliche Bestätigung, dass Sie (keine) Strafen haben. Arbeitgeber oder Behörden verlangen es manchmal. Antrag online über das Bundesamt für Justiz.",
    tip: "Für eine Bewerbung reicht meist der „einfache“ Antrag — der „erweiterte“ gilt z. B. für Tätigkeiten mit Kindern.",
  },
  {
    term: "Gewerbeanmeldung",
    category: "Papierkram",
    plain:
      "Die Registrierung eines Gewerbes beim Gewerbeamt. Notwendig für Selbstständige, die keine Freiberufler sind.",
  },
  {
    term: "Schufa",
    category: "Papierkram",
    plain:
      "Die Auskunftei, die Ihre Kreditwürdigkeit bewertet. Vermieter fragen oft nach der „Schufa-Auskunft“ (Datenkopie nach Art. 15 DSGVO).",
    tip: "Einmal pro Jahr kostenlos: www.meineschufa.de. Für die Wohnungssuche reicht eine Selbstauskunft plus Dokumente.",
  },
  {
    term: "Akte / Aktenzeichen",
    category: "Papierkram",
    plain:
      "Ihre Behördenakte und ihre eindeutige Nummer. Das Aktenzeichen steht oben auf jedem Bescheid und gehört in jede Korrespondenz.",
  },
];

const CATEGORIES = ["Alle", "Wohnen", "Steuern & Finanzen", "Aufenthalt", "Papierkram", "Recht & Fristen"] as const;

export default function Glossar() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Alle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((entry) => {
      const matchesCategory = category === "Alle" || entry.category === category;
      const matchesQuery =
        q === "" ||
        entry.term.toLowerCase().includes(q) ||
        entry.plain.toLowerCase().includes(q);
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
            <h1 className="text-3xl font-bold text-gray-900">
              Amtsdeutsch-Glossar
            </h1>
          </div>
          <p className="text-gray-600">
            Behördendeutsch in Klartext — {GLOSSARY.length} Begriffe einfach erklärt
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
              placeholder="Begriff suchen, z. B. „Kaution“…"
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

        {/* Entries */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center border border-gray-200 bg-white">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Keine Begriffe gefunden.</p>
            <p className="text-sm text-gray-400 mt-1">
              Versuchen Sie einen anderen Suchbegriff oder wählen Sie „Alle“.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((entry) => (
              <Card
                key={entry.term}
                className="p-6 border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-blue-700">
                    {entry.term}
                  </h3>
                  <span className="shrink-0 inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                    {entry.category}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mt-3">
                  {entry.plain}
                </p>
                {entry.tip && (
                  <div className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 border border-blue-100 px-3 py-2.5">
                    <span className="text-blue-700 text-sm font-medium">💡 Tipp:</span>
                    <p className="text-xs text-gray-700 leading-relaxed flex-1">
                      {entry.tip}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
