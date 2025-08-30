import { FileText, Play, Settings } from "lucide-react";
import React from "react";

// ---------- Sidebar ----------
function Sidebar({ view, setView }) {
  const items = [
    { id: 'chat', label: 'Docbot Chat', icon: FileText },
    { id: 'procedure', label: 'Procedure Mode', icon: Play },
    { id: 'quiz', label: 'Quiz & Spaced Rep', icon: Settings },
    { id: 'dashboard', label: 'Manager Dashboard', icon: FileText },
    { id: 'ingest', label: 'Ingest Docs', icon: FileText }
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="space-y-2">
        {items.map(it => (
          <button key={it.id} onClick={() => setView(it.id)} className={`w-full text-left flex items-center gap-3 p-3 rounded ${view===it.id? 'bg-indigo-50 border border-indigo-100':'hover:bg-gray-50'}`}>
            <it.icon className="h-5 w-5 text-indigo-500" />
            <span className="font-medium">{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="px-3">Tips:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Offline-first: cached SOPs</li>
          <li>Procedure Mode shows stepwise guidance</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;