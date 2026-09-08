import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Copy, Download, Mail } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * Brief-Vorlagen Generator
 * - Fertige Behördenbriefe mit Platzhaltern
 * - Formular ausfüllen, Vorschau prüfen, kopieren oder herunterladen
 * - Alles läuft lokal im Browser — keine Daten verlassen Ihr Gerät
 */

interface TemplateField {
  id: string;
  label: string;
  type?: "text" | "textarea" | "date";
  placeholder?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  subject: (v: Record<string, string>) => string;
  body: (v: Record<string, string>, date: string) => string;
}

const TEMPLATE_FIELDS_BASE: TemplateField[] = [
  { id: "name", label: "Ihr Name", placeholder: "Max Mustermann" },
  { id: "address", label: "Ihre Adresse", placeholder: "Musterstraße 12, 10115 Berlin" },
  { id: "recipient", label: "Empfänger (Behörde/Vermieter)", placeholder: "Bürgeramt Berlin" },
  { id: "recipientAddress", label: "Adresse des Empfängers", placeholder: "Musterplatz 1, 10115 Berlin" },
];

const TEMPLATES: Template[] = [
  {
    id: "widerspruch",
    name: "Widerspruch gegen Bescheid",
    description: "Legen Sie förmlich Widerspruch gegen einen Behördenbescheid ein.",
    subject: (v) => `Widerspruch gegen Ihren Bescheid vom ${v.bescheidDate}`,
    body: (v, date) =>
      `hiermit lege ich Widerspruch gegen Ihren Bescheid vom ${v.bescheidDate} ein.\n\nAktenzeichen: ${v.fileNumber || "[bitte Aktenzeichen ergänzen]"}\n\nBegründung:\n${v.reason || "[bitte Begründung ergänzen]"}\n\nIch bitte Sie, den Bescheid aufzuheben. Sollten Sie Unterlagen benötigen, stehe ich Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen\n${v.name}`,
  },
  {
    id: "kuendigung-wohnung",
    name: "Wohnung kündigen",
    description: "Ordentliche Kündigung Ihres Mietverhältnisses zum nächstmöglichen Termin.",
    subject: () => "Kündigung meines Mietverhältnisses",
    body: (v, date) =>
      `hiermit kündige ich das Mietverhältnis über die Wohnung\n\n${v.address.split(",")[0] || "[Ihre Adresse]"}\n\nordentlich und fristgerecht zum nächstmöglichen Zeitpunkt, spätestens zum ${v.terminationDate || "nächstmöglichen Termin"}.\n\nBitte bestätigen Sie mir den Erhalt dieser Kündigung sowie das Beendigungsdatum schriftlich. Außerdem bitte ich um Terminvorschläge für die Wohnungsübergabe.\n\nMit freundlichen Grüßen\n${v.name}`,
  },
  {
    id: "ratenzahlung",
    name: "Ratenzahlung beantragen",
    description: "Bitten Sie eine Behörde oder ein Amt um Zahlungserleichterung in Raten.",
    subject: () => "Antrag auf Ratenzahlung / Zahlungserleichterung",
    body: (v, date) =>
      `mit Schreiben vom ${v.invoiceDate || "[Datum des Bescheids]"} habe ich einen Zahlbetrag von ${v.amount || "[Betrag]"} EUR erhalten.\n\nDa ich derzeit nicht in der Lage bin, den Gesamtbetrag sofort zu zahlen, bitte ich um Zahlungserleichterung in Form von monatlichen Raten.\n\nVorschlag: Zahlung in ${v.installments || "[Anzahl]"} Monatsraten à ${v.perInstallment || "[Betrag]"} EUR, beginnend mit dem übernächsten Monatsersten.\n\nIch bitte um schriftliche Bestätigung dieses Vorschlags. Die erste Rate zahle ich sofort nach Erhalt Ihrer Zustimmung.\n\nMit freundlichen Grüßen\n${v.name}`,
  },
  {
    id: "rundfunk-befreiung",
    name: "Befreiung Rundfunkbeitrag",
    description: "Antrag auf Befreiung vom Rundfunkbeitrag (z. B. bei Bürgergeld, BAföG oder Ausbildung).",
    subject: () => "Antrag auf Befreiung vom Rundfunkbeitrag",
    body: (v, date) =>
      `hiermit beantrage ich eine Befreiung vom Rundfunkbeitrag.\n\nBegründung: ${v.reason || "[z. B. Bezug von Bürgergeld, BAföG, Ausbildungsvergütung]"}\n\nBeleg: ${v.evidence || "[z. B. Bescheid / Nachweis — beiliegend]"}\n\nMeine Beitragsnummer (falls vorhanden): ${v.accountNumber || "[falls vorhanden]"}\n\nDie entsprechenden Nachweise füge ich diesem Schreiben bei. Ich bitte um schriftliche Bestätigung der Befreiung sowie der Geltungsdauer.\n\nMit freundlichen Grüßen\n${v.name}`,
  },
  {
    id: "adressaenderung",
    name: "Adressänderung mitteilen",
    description: "Informieren Sie Ämter, Versicherungen oder Arbeitgeber über Ihren Umzug.",
    subject: () => "Mitteilung einer Adressänderung",
    body: (v, date) =>
      `hiermit möchte ich Ihnen mitteilen, dass ich zum ${v.moveDate || "[Einzugsdatum]"} meine Adresse geändert habe.\n\nNeue Adresse:\n${v.newAddress || v.address}\n\nBitte aktualisieren Sie Ihre Unterlagen entsprechend und bestätigen Sie mir den Erhalt dieser Mitteilung.\n\nMit freundlichen Grüßen\n${v.name}`,
  },
];

const todayGerman = () =>
  new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function BriefGenerator() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedId) ?? null,
    [selectedId]
  );

  const templateFields = useMemo<TemplateField[]>(() => {
    if (!selectedTemplate) return [];
    const extra: Record<string, TemplateField[]> = {
      widerspruch: [
        { id: "fileNumber", label: "Aktenzeichen", placeholder: "z. B. ABH-2026-1234" },
        { id: "bescheidDate", label: "Datum des Bescheids", type: "date" },
        { id: "reason", label: "Begründung", type: "textarea", placeholder: "Warum widersprechen Sie?" },
      ],
      "kuendigung-wohnung": [
        { id: "terminationDate", label: "Kündigung zum", type: "date" },
      ],
      ratenzahlung: [
        { id: "invoiceDate", label: "Datum des Bescheids/Rechnung", type: "date" },
        { id: "amount", label: "Gesamtbetrag (EUR)", placeholder: "z. B. 350" },
        { id: "installments", label: "Anzahl Raten", placeholder: "z. B. 6" },
        { id: "perInstallment", label: "Rate pro Monat (EUR)", placeholder: "z. B. 58,33" },
      ],
      "rundfunk-befreiung": [
        { id: "reason", label: "Grund der Befreiung", type: "textarea", placeholder: "z. B. BAföG-Bezug" },
        { id: "evidence", label: "Nachweis", placeholder: "z. B. BAföG-Bescheid" },
        { id: "accountNumber", label: "Beitragsnummer (optional)", placeholder: "z. B. 301-..." },
      ],
      adressaenderung: [
        { id: "moveDate", label: "Einzugsdatum", type: "date" },
        { id: "newAddress", label: "Neue Adresse", type: "textarea", placeholder: "Neue Straße, PLZ Ort" },
      ],
    };
    return [...TEMPLATE_FIELDS_BASE, ...(extra[selectedTemplate.id] ?? [])];
  }, [selectedTemplate]);

  const set = (id: string, v: string) =>
    setValues((prev) => ({ ...prev, [id]: v }));

  const letterText = useMemo(() => {
    if (!selectedTemplate) return "";
    const v = {
      ...values,
      name: values.name || "[Ihr Name]",
      address: values.address || "[Ihre Adresse]",
    };
    const header = `${v.name}\n${v.address}\n\n${values.recipient || "[Empfänger]"}\n${values.recipientAddress || "[Adresse des Empfängers]"}\n\n${todayGerman()}\n\n`;
    const subject = `Betreff: ${selectedTemplate.subject(v)}\n\n`;
    const salutation = `Sehr geehrte Damen und Herren,\n\n`;
    return header + subject + salutation + selectedTemplate.body(v, todayGerman());
  }, [selectedTemplate, values]);

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      toast.success("Brief in die Zwischenablage kopiert");
    } catch {
      toast.error("Kopieren nicht möglich — bitte Text manuell markieren");
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([letterText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate?.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Brief als .txt heruntergeladen");
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-gray-400";

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
            <h1 className="text-3xl font-bold text-gray-900">Brief-Vorlagen</h1>
          </div>
          <p className="text-gray-600">
            Fertige Behördenbriefe — Formular ausfüllen, kopieren oder herunterladen
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedTemplate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <Card
                key={t.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white"
                onClick={() => {
                  setSelectedId(t.id);
                  setValues({});
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{t.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{t.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <Card className="p-6 border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate.name}
                </h2>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Vorlage schließen"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {templateFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={values[field.id] ?? ""}
                        placeholder={field.placeholder}
                        onChange={(e) => set(field.id, e.target.value)}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        type={field.type === "date" ? "date" : "text"}
                        value={values[field.id] ?? ""}
                        placeholder={field.placeholder}
                        onChange={(e) => set(field.id, e.target.value)}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Ihre Daten bleiben vollständig in Ihrem Browser — es wird nichts
                versendet oder gespeichert.
              </p>
            </Card>

            {/* Preview */}
            <Card className="p-6 border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Vorschau</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={copyLetter}
                  >
                    <Copy className="w-4 h-4" /> Kopieren
                  </Button>
                  <Button
                    className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
                    onClick={downloadLetter}
                  >
                    <Download className="w-4 h-4" /> Herunterladen
                  </Button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-[480px] overflow-y-auto">
                {letterText}
              </pre>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
