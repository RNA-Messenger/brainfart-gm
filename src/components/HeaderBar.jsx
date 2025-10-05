import React from "react";

export default function HeaderBar({ view, setView, onAddNew, onExportCSV, onExportJSONLight, onExportJSONWithImages, onImportJSON, onReset, lastSavedAt }) {
  const importRef = React.useRef();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <h1 className="text-2xl font-bold">GM Campaign Tracker</h1>
        <span className="text-sm text-slate-500">Local-only. IndexedDB persistence.</span>

        <nav className="ml-6 flex gap-2">
          {["tracker","npcs","sets","maps"].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={(view===v ? "bg-slate-900 text-white " : "bg-white text-slate-700 ") + "px-3 py-1.5 rounded-full border border-slate-300 text-sm"}>
              {v === "tracker" ? "Tracker" : v.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {view === "tracker" && (
            <button className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 shadow" onClick={onAddNew}>
              ＋ New
            </button>
          )}
          <button className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100" onClick={() => importRef.current?.click()}>⬆ Import JSON</button>
          <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onImportJSON(e.target.files[0]); e.target.value=""; }} />
          <button className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100" onClick={onExportJSONWithImages}>⬇ Export JSON + Images</button>
          <button className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100" onClick={onExportJSONLight}>⬇ Export JSON (light)</button>
          <button className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100" onClick={onExportCSV}>⬇ CSV</button>
          <button className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100" onClick={onReset}>⟲ Reset</button>
        </div>

        <div className="ml-3 text-xs text-slate-500 hidden sm:block">
          {lastSavedAt ? <>Saved: <span className="font-medium">{new Date(lastSavedAt).toLocaleTimeString()}</span></> : "Autosave ready"}
        </div>
      </div>
    </header>
  );
}
