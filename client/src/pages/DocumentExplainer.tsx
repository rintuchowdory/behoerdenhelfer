import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Design: Minimalistisches Vertrauens-Design
 * - Dokument-Upload und Erklärung
 * - Abschnittweise Erklärungen mit Beispielen
 * - Klare Struktur für Behördendokumente
 */

interface DocumentSection {
  title: string;
  content: string;
  explanation: string;
  importance: "high" | "medium" | "low";
}

const SAMPLE_DOCUMENTS: Record<string, { name: string; sections: DocumentSection[] }> = {
  meldeschein: {
    name: "Meldeschein (Wohnanmeldung)",
    sections: [
      {
        title: "Persönliche Daten",
        content: "Name, Vorname, Geburtsdatum, Geburtsort",
        explanation:
          "Dies sind Ihre grundlegenden persönlichen Informationen. Sie müssen exakt wie in Ihrem Personalausweis eingetragen sein.",
        importance: "high",
      },
      {
        title: "Wohnadresse",
        content: "Straße, Hausnummer, Postleitzahl, Stadt",
        explanation:
          "Die Adresse der Wohnung, in die Sie einziehen. Dies wird Ihre offizielle Adresse in Deutschland.",
        importance: "high",
      },
      {
        title: "Einzugsdatum",
        content: "Datum des Einzugs",
        explanation:
          "Das Datum, an dem Sie tatsächlich in die Wohnung eingezogen sind. Nicht das Datum des Mietvertrags.",
        importance: "high",
      },
      {
        title: "Unterschrift",
        content: "Ihre handschriftliche Unterschrift",
        explanation:
          "Ihre Unterschrift ist erforderlich. Sie können nicht digital unterschreiben.",
        importance: "high",
      },
    ],
  },
  arbeitsvertrag: {
    name: "Arbeitsvertrag",
    sections: [
      {
        title: "Vertragsparteien",
        content: "Arbeitgeber und Arbeitnehmer",
        explanation:
          "Hier werden der Arbeitgeber und Sie als Arbeitnehmer identifiziert.",
        importance: "high",
      },
      {
        title: "Tätigkeit",
        content: "Beschreibung der Arbeitsaufgaben",
        explanation:
          "Eine genaue Beschreibung Ihrer Aufgaben und Verantwortungen.",
        importance: "high",
      },
      {
        title: "Arbeitszeit",
        content: "Wöchentliche Stunden und Arbeitszeiten",
        explanation:
          "Wie viele Stunden pro Woche Sie arbeiten und zu welchen Zeiten.",
        importance: "high",
      },
      {
        title: "Gehalt",
        content: "Brutto- und Nettovergütung",
        explanation:
          "Ihr monatliches Gehalt. Achten Sie auf die genaue Höhe und Zahlungsweise.",
        importance: "high",
      },
      {
        title: "Urlaub",
        content: "Anzahl der Urlaubstage pro Jahr",
        explanation:
          "Die Mindestanzahl ist 20 Tage pro Jahr in Deutschland.",
        importance: "medium",
      },
    ],
  },
  mietvertrag: {
    name: "Mietvertrag",
    sections: [
      {
        title: "Vermieter und Mieter",
        content: "Identifikation beider Parteien",
        explanation:
          "Der Name und die Adresse des Vermieters und des Mieters.",
        importance: "high",
      },
      {
        title: "Mietobjekt",
        content: "Beschreibung der Wohnung",
        explanation:
          "Größe, Lage, Anzahl der Zimmer und andere Merkmale der Wohnung.",
        importance: "high",
      },
      {
        title: "Miete",
        content: "Höhe der Miete und Nebenkosten",
        explanation:
          "Die monatliche Miete und welche Nebenkosten enthalten sind.",
        importance: "high",
      },
      {
        title: "Kaution",
        content: "Höhe und Bedingungen der Kaution",
        explanation:
          "Die Kaution darf maximal 3 Monatsmieten betragen.",
        importance: "high",
      },
      {
        title: "Kündigungsfrist",
        content: "Bedingungen für die Beendigung des Vertrags",
        explanation:
          "Wie lange im Voraus Sie oder der Vermieter kündigen müssen.",
        importance: "medium",
      },
    ],
  },
};

interface UploadedFile {
  name: string;
  text: string;
}

export default function DocumentExplainer() {
  const [, navigate] = useLocation();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isText =
      file.type.startsWith("text/") ||
      /\.(txt|md|csv)$/i.test(file.name);
    if (isText) {
      try {
        const text = await file.text();
        setUploadedFile({ name: file.name, text });
        toast.success(`„${file.name}“ geladen`);
      } catch {
        toast.error("Datei konnte nicht gelesen werden");
      }
    } else {
      setUploadedFile({ name: file.name, text: "" });
      toast.info(
        "Für PDFs & Scans ist der Text nicht direkt lesbar — nutzen Sie die Beispieldokumente oder das Glossar."
      );
    }
    e.target.value = "";
  };

  const currentDoc =
    selectedDoc && SAMPLE_DOCUMENTS[selectedDoc]
      ? SAMPLE_DOCUMENTS[selectedDoc]
      : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Dokument Erklärer
            </h1>
          </div>
          <p className="text-gray-600">
            Verstehen Sie deutsche Behördendokumente einfach und schnell
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedDoc ? (
          // Document Selection View
          <div className="space-y-6">
            {/* Upload Section */}
            <Card
              className="p-8 border-2 border-dashed border-gray-300 bg-white text-center hover:border-blue-700 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ihr eigenes Dokument hochladen
              </h3>
              <p className="text-gray-600 mb-4">
                Textdatei (.txt) hochladen — bleibt vollständig lokal auf Ihrem Gerät
              </p>
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                Datei auswählen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.csv,text/plain,text/markdown,text/csv"
                className="hidden"
                onChange={handleFileSelect}
              />
            </Card>

            {/* Uploaded file preview */}
            {uploadedFile && (
              <Card className="p-6 border border-blue-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{uploadedFile.name}</h3>
                      <p className="text-xs text-gray-500">
                        {uploadedFile.text.length > 0
                          ? `${uploadedFile.text.length} Zeichen geladen`
                          : "Kein lesbarer Textinhalt"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Datei entfernen"
                  >
                    ✕
                  </button>
                </div>
                {uploadedFile.text.length > 0 ? (
                  <>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-64 overflow-y-auto">
                      {uploadedFile.text}
                    </pre>
                    <p className="text-xs text-gray-500 mt-3">
                      Tipp: Unklare Begriffe können Sie im{" "}
                      <a
                        className="text-blue-700 font-medium hover:underline"
                        href={(import.meta.env.BASE_URL + "glossar").replace(/([^:]\/)\/+/g, "$1")}
                      >
                        Amtsdeutsch-Glossar
                      </a>{" "}
                        nachschlagen.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    Für PDFs und Scans: Nutzen Sie die Beispieldokumente unten oder das
                    Amtsdeutsch-Glossar für typische Abschnitte und Begriffe.
                  </p>
                )}
              </Card>
            )}

            {/* Sample Documents */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Häufige Dokumente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(SAMPLE_DOCUMENTS).map(([key, doc]) => (
                  <Card
                    key={key}
                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white"
                    onClick={() => setSelectedDoc(key)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {doc.sections.length} Abschnitte erklärt
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Document Detail View
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentDoc?.name}
                </h2>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600">
                Hier finden Sie detaillierte Erklärungen zu jedem Abschnitt dieses Dokuments
              </p>
            </div>

            {/* Document Sections */}
            <div className="space-y-4">
              {currentDoc?.sections.map((section, index) => (
                <Card
                  key={index}
                  className="p-6 border border-gray-200 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                        section.importance === "high"
                          ? "bg-red-500"
                          : section.importance === "medium"
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {section.title}
                      </h3>

                      {/* Original Content */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 font-mono">
                          {section.content}
                        </p>
                      </div>

                      {/* Explanation */}
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Was bedeutet das?
                          </p>
                          <p className="text-gray-600">{section.explanation}</p>
                        </div>
                      </div>

                      {/* Importance Badge */}
                      <div className="mt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            section.importance === "high"
                              ? "bg-red-100 text-red-800"
                              : section.importance === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {section.importance === "high"
                            ? "Sehr wichtig"
                            : section.importance === "medium"
                              ? "Wichtig"
                              : "Informativ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setSelectedDoc(null)}
              >
                Zurück
              </Button>
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                Als PDF speichern
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
