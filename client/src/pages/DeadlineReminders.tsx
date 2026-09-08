import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Plus, Bell, Calendar, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Design: Minimalistisches Vertrauens-Design
 * - Fristen-Verwaltung mit dynamischer Dringlichkeits-Berechnung
 * - Farbcodierte Dringlichkeit (Rot für dringend, Amber für bald, Grün für ok)
 * - Fristen werden lokal im Browser gespeichert (localStorage)
 */

interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO yyyy-mm-dd
  category: string;
  status: "pending" | "in-progress" | "completed";
}

const STORAGE_KEY = "bh:deadlines";

const isoInDays = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const makeSampleDeadlines = (): Deadline[] => [
  {
    id: "1",
    title: "Wohnanmeldung",
    description: "Anmeldung der neuen Wohnung beim Bürgeramt (innerhalb von 14 Tagen nach Einzug)",
    dueDate: isoInDays(7),
    category: "Behörde",
    status: "pending",
  },
  {
    id: "2",
    title: "Krankenversicherung abschließen",
    description: "Versicherung muss innerhalb kürzester Zeit nach Ankunft abgeschlossen sein",
    dueDate: isoInDays(2),
    category: "Versicherung",
    status: "pending",
  },
  {
    id: "3",
    title: "Steuernummer beantragen",
    description: "Beantragung beim Finanzamt (läuft meist automatisch nach der Anmeldung)",
    dueDate: isoInDays(19),
    category: "Steuern",
    status: "pending",
  },
  {
    id: "4",
    title: "Bankkonto eröffnen",
    description: "Eröffnung eines Girokontos für Gehalt und Abbuchungen",
    dueDate: isoInDays(12),
    category: "Finanzen",
    status: "in-progress",
  },
  {
    id: "5",
    title: "Mietvertrag unterschreiben",
    description: "Unterschrift des Mietvertrags",
    dueDate: isoInDays(-3),
    category: "Wohnung",
    status: "completed",
  },
];

const daysUntil = (dueDate: string) =>
  Math.ceil(
    (new Date(`${dueDate}T23:59:59`).getTime() - Date.now()) / 86_400_000
  );

const getUrgencyColor = (days: number): string => {
  if (days < 0) return "bg-green-50 border-green-200";
  if (days <= 3) return "bg-red-50 border-red-200";
  if (days <= 7) return "bg-amber-50 border-amber-200";
  return "bg-blue-50 border-blue-200";
};

const getUrgencyBadgeColor = (days: number) => {
  if (days < 0) return "bg-green-100 text-green-800";
  if (days <= 3) return "bg-red-100 text-red-800";
  if (days <= 7) return "bg-amber-100 text-amber-800";
  return "bg-blue-100 text-blue-800";
};

const getUrgencyIcon = (days: number) => {
  if (days < 0) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  if (days <= 3) return <AlertTriangle className="w-5 h-5 text-red-600" />;
  return <Calendar className="w-5 h-5 text-amber-600" />;
};

const loadDeadlines = (): Deadline[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Deadline[];
  } catch {
    // korrupte Daten → zurück zu den Beispielen
  }
  return makeSampleDeadlines();
};

export default function DeadlineReminders() {
  const [, navigate] = useLocation();
  const [deadlines, setDeadlines] = useState<Deadline[]>(loadDeadlines);
  const [filter, setFilter] = useState<"all" | "pending" | "urgent">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Persistiert bei jeder Änderung
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines));
  }, [deadlines]);

  const filteredDeadlines = deadlines.filter((d) => {
    const days = daysUntil(d.dueDate);
    if (filter === "pending") return d.status === "pending" || d.status === "in-progress";
    if (filter === "urgent") return days <= 7 && d.status !== "completed";
    return true;
  });

  const sortedDeadlines = [...filteredDeadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const toggleStatus = (id: string) => {
    setDeadlines(
      deadlines.map((d) =>
        d.id === id
          ? {
              ...d,
              status:
                d.status === "completed"
                  ? "pending"
                  : d.status === "pending"
                    ? "in-progress"
                    : "completed",
            }
          : d
      )
    );
  };

  const removeDeadline = (id: string) => {
    setDeadlines(deadlines.filter((d) => d.id !== id));
    toast.success("Frist gelöscht");
  };

  const addDeadline = () => {
    if (!newTitle.trim() || !newDueDate) {
      toast.error("Bitte Titel und Datum angeben");
      return;
    }
    setDeadlines((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        title: newTitle.trim(),
        description: newDescription.trim() || "Eigene Frist",
        dueDate: newDueDate,
        category: newCategory.trim() || "Allgemein",
        status: "pending",
      },
    ]);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    setNewCategory("");
    setShowAddForm(false);
    toast.success("Frist hinzugefügt");
  };

  const resetSamples = () => {
    setDeadlines(makeSampleDeadlines());
    toast.info("Beispielfristen wiederhergestellt");
  };

  const urgentCount = deadlines.filter(
    (d) => daysUntil(d.dueDate) <= 3 && daysUntil(d.dueDate) >= 0 && d.status !== "completed"
  ).length;
  const completedCount = deadlines.filter((d) => d.status === "completed").length;

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
            <h1 className="text-3xl font-bold text-gray-900">
              Fristen Manager
            </h1>
          </div>
          <p className="text-gray-600">
            Verwalten Sie Ihre Behörden-Fristen — Dringlichkeit wird täglich neu berechnet
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Gesamt Fristen</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {deadlines.length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-700 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Dringend (≤ 3 Tage)</p>
                <p className="text-3xl font-bold text-red-700 mt-2">
                  {urgentCount}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-700 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Erledigt</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {completedCount}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-700 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-blue-700 text-white" : ""}
            onClick={() => setFilter("all")}
          >
            Alle
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            className={filter === "pending" ? "bg-blue-700 text-white" : ""}
            onClick={() => setFilter("pending")}
          >
            Ausstehend
          </Button>
          <Button
            variant={filter === "urgent" ? "default" : "outline"}
            className={filter === "urgent" ? "bg-red-700 text-white" : ""}
            onClick={() => setFilter("urgent")}
          >
            Dringend
          </Button>
          <div className="flex-1" />
          <Button
            className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
            onClick={() => setShowAddForm((s) => !s)}
          >
            <Plus className="w-4 h-4" />
            Neue Frist hinzufügen
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="p-6 border border-blue-200 bg-white mb-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Neue Frist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Titel</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="z. B. Aufenthaltserlaubnis verlängern"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fällig am</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategorie</label>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="z. B. Behörde, Versicherung, Steuern"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Beschreibung (optional)</label>
                <input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details zur Frist"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={addDeadline}>
                Hinzufügen
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700" onClick={() => setShowAddForm(false)}>
                Abbrechen
              </Button>
            </div>
          </Card>
        )}

        {/* Deadlines List */}
        <div className="space-y-4">
          {sortedDeadlines.length === 0 ? (
            <Card className="p-12 text-center border border-gray-200 bg-white">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Keine Fristen gefunden
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "Legen Sie Ihre erste Frist an — oder stellen Sie die Beispiele wieder her."
                  : "Für diesen Filter gibt es aktuell keine Fristen."}
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2 mx-auto"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4" />
                  Neue Frist hinzufügen
                </Button>
                {filter === "all" && (
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                    onClick={resetSamples}
                  >
                    Beispiele wiederherstellen
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            sortedDeadlines.map((deadline) => {
              const days = daysUntil(deadline.dueDate);
              return (
                <Card
                  key={deadline.id}
                  className={`p-6 border-2 cursor-pointer transition-all hover:shadow-md ${getUrgencyColor(days)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <button
                      onClick={() => toggleStatus(deadline.id)}
                      className="flex-shrink-0 mt-1"
                      aria-label="Status wechseln"
                    >
                      {getUrgencyIcon(days)}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3
                            className={`text-lg font-bold transition-all ${
                              deadline.status === "completed"
                                ? "text-gray-400 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {deadline.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {deadline.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getUrgencyBadgeColor(days)}`}
                          >
                            {days < 0
                              ? "Überfällig"
                              : days === 0
                                ? "Heute"
                                : days === 1
                                  ? "Morgen"
                                  : `${days} Tage`}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(`${deadline.dueDate}T12:00:00`).toLocaleDateString("de-DE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">
                            {deadline.category}
                          </span>
                          <span
                            className={`px-2 py-1 rounded font-medium text-xs ${
                              deadline.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : deadline.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {deadline.status === "completed"
                              ? "Erledigt"
                              : deadline.status === "in-progress"
                                ? "In Arbeit"
                                : "Offen"}
                          </span>
                        </div>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-700" />
                          <span className="text-sm text-blue-700 font-medium">
                            Erinnerung aktiv
                          </span>
                        </div>
                        <button
                          onClick={() => removeDeadline(deadline.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Frist „${deadline.title}“ löschen`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <p className="mt-8 text-xs text-gray-400 text-center">
          Ihre Fristen werden nur lokal in Ihrem Browser gespeichert — niemand sonst kann sie sehen.
        </p>
      </div>
    </div>
  );
}
