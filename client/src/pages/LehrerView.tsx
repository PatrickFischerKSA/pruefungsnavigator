/* ============================================================
   LEHRPERSON-ANSICHT
   Design: Functional Futurism
   ============================================================ */
import Layout from "@/components/Layout";
import { GraduationCap, ExternalLink, Copy, CheckCircle, Users, Eye, MessageSquare, FileText, Lightbulb, BookOpen, ClipboardList, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => toast.success("Text kopiert!"));
};

const toolsForTeacher = [
  {
    name: "Google NotebookLM",
    url: "https://notebooklm.google.com",
    color: "cyan",
    icon: "NLM",
    desc: "Schüler*innen teilen ihr Notizbuch. Sie sehen alle KI-Gespräche, Zusammenfassungen und Quellen. Kommentarfunktion über Google-Sharing.",
    howTo: [
      "Schüler*innen klicken im Notizbuch auf das Teilen-Symbol (oben rechts)",
      "Sie geben Ihre E-Mail-Adresse ein und wählen 'Betrachter' oder 'Kommentator'",
      "Sie erhalten eine E-Mail-Einladung und können das Notizbuch einsehen",
      "Alle KI-Gespräche, Notizen und Quellen sind für Sie sichtbar",
    ],
  },
  {
    name: "CryptPad",
    url: "https://cryptpad.fr",
    color: "teal",
    icon: "CP",
    desc: "Schüler*innen laden ihr Lernjournal oder ihre Zusammenfassung in CryptPad hoch. Sie können direkt im Dokument kommentieren.",
    howTo: [
      "Schüler*innen erstellen ein neues CryptPad-Dokument",
      "Sie teilen den Link mit Ihnen (Lese- oder Bearbeitungszugriff)",
      "Sie können das Dokument öffnen und direkt kommentieren",
      "Keine Anmeldung für Betrachter nötig",
    ],
  },
  {
    name: "Fobizz",
    url: "https://app.fobizz.com",
    color: "purple",
    icon: "FOB",
    desc: "Lehrkräfte können über Fobizz Klassen anlegen, Aufgaben stellen und Ergebnisse einsehen. Die Basis-Lizenz ist kostenlos.",
    howTo: [
      "Erstellen Sie ein kostenloses Lehrperson-Konto auf fobizz.com",
      "Legen Sie eine Klasse an und laden Sie Schüler*innen ein",
      "Stellen Sie Aufgaben oder teilen Sie Arbeitsblätter",
      "Sehen Sie Ergebnisse und Bearbeitungsstände ein",
    ],
  },
];

const feedbackTemplates = [
  {
    title: "Allgemeines Fortschritts-Feedback",
    text: `Liebes Lernteam,

ich habe euer NotebookLM-Notizbuch / euer Lernjournal durchgesehen. Hier sind meine Beobachtungen:

Stärken:
- [STÄRKEN EINTRAGEN]

Verbesserungspotenzial:
- [VERBESSERUNGEN EINTRAGEN]

Empfehlungen für die weitere Vorbereitung:
- [EMPFEHLUNGEN EINTRAGEN]

Weiter so! Meldet euch, wenn ihr Fragen habt.`,
  },
  {
    title: "Feedback zu KI-Nutzung",
    text: `Ich habe eure KI-Gespräche in NotebookLM gesehen. Folgendes fällt mir auf:

Ihr nutzt die KI [gut/noch nicht optimal], weil [BEGRÜNDUNG].

Tipps für bessere Prompts:
- Seid spezifischer: Statt "Erkläre X" → "Erkläre X anhand eines Beispiels aus [KONTEXT]"
- Hinterfragt die KI: "Bist du sicher? Welche Quellen belegen das?"
- Nutzt die Feynman-Methode: "Erkläre mir X so, als wäre ich 12 Jahre alt"

Weiter so!`,
  },
  {
    title: "Feedback zum Lernjournal",
    text: `Ich habe euer Lernjournal gelesen. Meine Rückmeldung:

Reflexionstiefe: [BEWERTUNG]
Was mir auffällt: [BEOBACHTUNG]
Meine Empfehlung: [EMPFEHLUNG]

Besonders gut: [POSITIVES]
Noch zu vertiefen: [VERBESSERUNG]`,
  },
];

const phaseOverview = [
  { num: 1, title: "Unterlagen hochladen", href: "/phase/1", color: "cyan", icon: BookOpen, check: "Unterlagen und Modellprüfungen vorhanden?" },
  { num: 2, title: "KI-Analyse", href: "/phase/2", color: "emerald", icon: Eye, check: "NotebookLM-Notizbuch geteilt?" },
  { num: 3, title: "Probeprüfung", href: "/phase/3", color: "amber", icon: ClipboardList, check: "Probeprüfung generiert und bearbeitet?" },
  { num: 4, title: "Lernstrategien", href: "/phase/4", color: "purple", icon: BookOpen, check: "Strategie gewählt und Lernplan erstellt?" },
  { num: 5, title: "Reflexion", href: "/phase/5", color: "rose", icon: MessageSquare, check: "Lernjournal ausgefüllt und geteilt?" },
];

export default function LehrerView() {
  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
    emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
    purple: "border-purple-500/30 bg-purple-500/8 text-purple-300",
    rose: "border-rose-500/30 bg-rose-500/8 text-rose-300",
    teal: "border-teal-500/30 bg-teal-500/8 text-teal-300",
  };
  const iconColorMap: Record<string, string> = {
    cyan: "text-cyan-400", emerald: "text-emerald-400",
    amber: "text-amber-400", purple: "text-purple-400",
    rose: "text-rose-400", teal: "text-teal-400",
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-500/20 border border-slate-500/30 flex items-center justify-center">
              <GraduationCap size={18} className="text-slate-300" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Lehrperson-Ansicht</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Begleitung & Feedback</h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Als Lehrperson kannst du den Lernprozess der Schüler*innen mitlesen, kommentieren und gezielt Feedback geben. Alle Tools sind kostenlos und erfordern keine zusätzliche Software.
          </p>
        </div>

        {/* Phase Overview */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Phasen-Checkliste für Lehrpersonen</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {phaseOverview.map((phase) => {
              const Icon = phase.icon;
              return (
                <Link key={phase.num} href={phase.href}>
                  <div className={`border rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all ${colorMap[phase.color]}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-lg font-black ${iconColorMap[phase.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>{phase.num}</span>
                      <Icon size={13} className={iconColorMap[phase.color]} />
                    </div>
                    <p className="text-white text-xs font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{phase.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{phase.check}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-xs font-semibold ${iconColorMap[phase.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>Ansehen</span>
                      <ArrowRight size={10} className={iconColorMap[phase.color]} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Tools für Lehrpersonen */}
          <div>
            <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Wie du Ergebnisse mitlesen kannst</h2>
            <div className="space-y-4">
              {toolsForTeacher.map((tool) => (
                <div key={tool.name} className="border border-white/8 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${colorMap[tool.color]}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>{tool.name}</p>
                      <p className="text-slate-400 text-xs">{tool.desc}</p>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold ${colorMap[tool.color]} hover:opacity-80`}
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      <ExternalLink size={9} />
                      Öffnen
                    </a>
                  </div>
                  <div className="p-4 space-y-2" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                    {tool.howTo.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={12} className={iconColorMap[tool.color] + " flex-shrink-0 mt-0.5"} />
                        <p className="text-slate-400 text-xs">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback-Vorlagen */}
          <div>
            <h2 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Feedback-Vorlagen</h2>
            <div className="space-y-3">
              {feedbackTemplates.map((tmpl, idx) => (
                <div key={idx} className="border border-white/8 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
                    <p className="text-white font-semibold text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>{tmpl.title}</p>
                    <button
                      onClick={() => copyText(tmpl.text)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-white/15 text-slate-400 hover:text-white text-xs transition-colors"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      <Copy size={10} />
                      Kopieren
                    </button>
                  </div>
                  <div className="p-4" style={{ background: "oklch(0.175 0.028 264.695)" }}>
                    <pre className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap font-sans">{tmpl.text}</pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Hinweis Datenschutz */}
            <div className="mt-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
              <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 font-semibold text-xs mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Datenschutz-Hinweis</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  CryptPad ist vollständig Ende-zu-Ende-verschlüsselt und DSGVO-konform. Fobizz ist speziell für den Schulbereich entwickelt und erfüllt alle Datenschutzanforderungen. NotebookLM speichert Daten auf Google-Servern – informiere Schüler*innen entsprechend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Hinweis */}
        <div className="p-5 rounded-xl border border-white/8" style={{ background: "oklch(0.208 0.028 264.364)" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <FileText size={14} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>GitHub Deployment</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Diese Anwendung kann als statische Website auf GitHub Pages deployed werden. Alle Inhalte sind im Quellcode enthalten – keine Serverinfrastruktur nötig. Forke das Repository und aktiviere GitHub Pages in den Repository-Einstellungen.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "GitHub Pages", url: "https://pages.github.com" },
                  { label: "Netlify (kostenlos)", url: "https://netlify.com" },
                  { label: "Vercel (kostenlos)", url: "https://vercel.com" },
                ].map((d) => (
                  <a
                    key={d.label}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    <ExternalLink size={10} />
                    {d.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
