import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Trash2, Download } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Design: Minimalistisches Vertrauens-Design
 * - Klare Checklisten-Struktur mit Häkchen
 * - Kategorisierte Aufgaben für verschiedene Behördengänge
 * - Fortschrittsanzeige mit visuellen Indikatoren
 */

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}

interface Checklist {
  id: string;
  name: string;
  description: string;
  items: ChecklistItem[];
}

const PREDEFINED_CHECKLISTS: Checklist[] = [
  {
    id: "wohnanmeldung",
    name: "Wohnanmeldung",
    description: "Alles was Sie für die Anmeldung einer neuen Wohnung brauchen",
    items: [
      {
        id: "1",
        title: "Mietvertrag unterschrieben",
        description: "Stellen Sie sicher, dass der Mietvertrag von beiden Parteien unterzeichnet ist",
        completed: false,
        category: "Vorbereitung",
      },
      {
        id: "2",
        title: "Wohnungsübergabe dokumentieren",
        description: "Erstellen Sie ein Übergabeprotokoll mit Fotos und Zustandsbeschreibung",
        completed: false,
        category: "Vorbereitung",
      },
      {
        id: "3",
        title: "Zum Bürgeramt gehen",
        description: "Termin vereinbaren oder während der Öffnungszeiten vorbeigehen",
        completed: false,
        category: "Behörde",
      },
      {
        id: "4",
        title: "Anmeldeformular ausfüllen",
        description: "Formular 'Anmeldung einer Wohnung' (Meldeschein) ausfüllen",
        completed: false,
        category: "Behörde",
      },
      {
        id: "5",
        title: "Dokumente einreichen",
        description: "Personalausweis, Mietvertrag und Anmeldeformular vorlegen",
        completed: false,
        category: "Behörde",
      },
      {
        id: "6",
        title: "Meldebescheinigung erhalten",
        description: "Erhalten Sie die offizielle Meldebescheinigung",
        completed: false,
        category: "Abschluss",
      },
    ],
  },
  {
    id: "versicherungen",
    name: "Versicherungen",
    description: "Wichtige Versicherungen für Ihren Aufenthalt in Deutschland",
    items: [
      {
        id: "1",
        title: "Krankenversicherung abschließen",
        description: "Wählen Sie eine Krankenkasse und schließen Sie eine Versicherung ab",
        completed: false,
        category: "Versicherung",
      },
      {
        id: "2",
        title: "Haftpflichtversicherung",
        description: "Schließen Sie eine Privathaftpflichtversicherung ab",
        completed: false,
        category: "Versicherung",
      },
      {
        id: "3",
        title: "Hausratversicherung (optional)",
        description: "Versichern Sie Ihre persönlichen Gegenstände",
        completed: false,
        category: "Versicherung",
      },
    ],
  },
  {
    id: "steuern",
    name: "Steuern & Finanzen",
    description: "Steuerliche Anforderungen und finanzielle Verpflichtungen",
    items: [
      {
        id: "1",
        title: "Steuernummer beantragen",
        description: "Beantragen Sie eine Steuernummer beim Finanzamt",
        completed: false,
        category: "Steuern",
      },
      {
        id: "2",
        title: "Bankkonto eröffnen",
        description: "Eröffnen Sie ein Bankkonto bei einer deutschen Bank",
        completed: false,
        category: "Finanzen",
      },
      {
        id: "3",
        title: "Steuererklärung vorbereiten",
        description: "Sammeln Sie alle notwendigen Unterlagen für die Steuererklärung",
        completed: false,
        category: "Steuern",
      },
    ],
  },
];

export default function ChecklistGenerator() {
  const [, navigate] = useLocation();
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const selectChecklist = (checklist: Checklist) => {
    setSelectedChecklist(checklist);
    try {
      const saved = localStorage.getItem(`bh:checklist:${checklist.id}`);
      setItems(saved ? (JSON.parse(saved) as ChecklistItem[]) : checklist.items);
    } catch {
      setItems(checklist.items);
    }
  };

  // Fortschritt lokal speichern
  useEffect(() => {
    if (selectedChecklist) {
      localStorage.setItem(
        `bh:checklist:${selectedChecklist.id}`,
        JSON.stringify(items)
      );
    }
  }, [items, selectedChecklist]);

  const addItem = () => {
    if (!newTitle.trim()) return;
    setItems([
      ...items,
      {
        id: `custom-${Date.now()}`,
        title: newTitle.trim(),
        description: newDescription.trim() || "Eigene Aufgabe",
        completed: false,
        category: newCategory.trim() || "Eigene",
      },
    ]);
    setNewTitle("");
    setNewDescription("");
    setNewCategory("");
    setShowAddForm(false);
  };

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const downloadChecklist = () => {
    const content = `
${selectedChecklist?.name}
${selectedChecklist?.description}

${items.map((item) => `${item.completed ? "✓" : "○"} ${item.title}\n   ${item.description}`).join("\n\n")}

Fortschritt: ${completedCount}/${totalCount} (${Math.round(progressPercent)}%)
    `.trim();

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `${selectedChecklist?.name}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
              Checklisten Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Erstellen Sie personalisierte Checklisten für Ihre Behördengänge
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedChecklist ? (
          // Checklist Selection View
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREDEFINED_CHECKLISTS.map((checklist) => (
              <Card
                key={checklist.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white"
                onClick={() => selectChecklist(checklist)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {checklist.name}
                </h3>
                <p className="text-gray-600 mb-4">{checklist.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {checklist.items.length} Aufgaben
                  </span>
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                    Öffnen
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Checklist Detail View
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedChecklist.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {selectedChecklist.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedChecklist(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Fortschritt
                  </span>
                  <span className="text-sm font-bold text-blue-700">
                    {completedCount}/{totalCount} ({Math.round(progressPercent)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-700 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 border border-gray-200 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4
                        className={`font-medium transition-all ${
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Form */}
            {showAddForm && (
              <Card className="p-6 border border-blue-200 bg-white space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Neue Aufgabe</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Titel</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="z. B. Termin beim Bürgeramt buchen"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Beschreibung (optional)</label>
                    <input
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Details zur Aufgabe"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategorie</label>
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="z. B. Vorbereitung"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={addItem}>
                    Hinzufügen
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddForm(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-between">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setSelectedChecklist(null)}
              >
                Zurück
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={downloadChecklist}
                >
                  <Download className="w-4 h-4" />
                  Herunterladen
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
                  onClick={() => setShowAddForm((s) => !s)}
                >
                  <Plus className="w-4 h-4" />
                  Neue Aufgabe
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
