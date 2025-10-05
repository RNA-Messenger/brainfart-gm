import React from "react";
import Papa from "papaparse";
import HeaderBar from "./components/HeaderBar";
import UploadBar from "./components/UploadBar";
import FiltersBar from "./components/FiltersBar";
import StatsBar from "./components/StatsBar";
import SectionsPanel from "./components/SectionsPanel";
import DataTable from "./components/DataTable";
import NpcForm from "./components/NpcForm";
import NpcLibrary from "./components/NpcLibrary";
import SetForm from "./components/SetForm";
import SetLibrary from "./components/SetLibrary";
import MapForm from "./components/MapForm";
import MapGallery from "./components/MapGallery";
import { normalizeHeader, STATUS_OPTIONS } from "./utils/helpers";

const DEFAULT_META_COLS = ["Status", "Category"];

function ensureMeta(record) {
  const r = { ...record };
  for (const k of DEFAULT_META_COLS) if (!(k in r)) r[k] = "";
  return r;
}

export default function App() {
  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [editingId, setEditingId] = React.useState(null);
  const [filters, setFilters] = React.useState({ search: "", Status: "", Category: "", Tier: "", Act: "" });
  const [sort] = React.useState({ key: "", dir: "asc" });
  const [view, setView] = React.useState("tracker"); // tracker | npcs | sets | maps

  // Libraries
  const [npcLib, setNpcLib] = React.useState([]); // {id, name, notes, img}
  const [setLib, setSetLib] = React.useState([]); // {id, name, notes, img}
  const [mapLib, setMapLib] = React.useState([]); // {id, title, notes, img}

  React.useEffect(() => {
    const raw = localStorage.getItem("gm-tracker-data");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const cols = (parsed.columns || []).map(normalizeHeader);
        const merged = [...new Set([...cols, ...DEFAULT_META_COLS])];
        setColumns(merged);
        setRows((parsed.rows || []).map(ensureMeta));
        setNpcLib(parsed.npcLib || []);
        setSetLib(parsed.setLib || []);
        setMapLib(parsed.mapLib || []);
      } catch {}
    }
  }, []);

  React.useEffect(() => {
    if (!columns.length) return;
    localStorage.setItem("gm-tracker-data", JSON.stringify({ columns, rows, npcLib, setLib, mapLib }));
  }, [columns, rows, npcLib, setLib, mapLib]);

  const visibleRows = React.useMemo(() => {
    let data = [...rows];
    data = data.filter((r) => {
      const txt = Object.values(r).join(" \n ").toLowerCase();
      const okSearch = !filters.search || txt.includes(filters.search.toLowerCase());
      const okStatus = !filters.Status || (r["Status"] || "") === filters.Status;
      const okCat = !filters.Category || (r["Category"] || "") === filters.Category;
      const okTier = !filters.Tier || (r["Tier"] || "") === filters.Tier;
      const okAct = !filters.Act || (r["Act"] || "") === filters.Act;
      return okSearch && okStatus && okCat && okTier && okAct;
    });
    if (sort.key) {
      data.sort((a, b) => {
        const va = (a[sort.key] ?? "").toString().toLowerCase();
        const vb = (b[sort.key] ?? "").toString().toLowerCase();
        if (va < vb) return sort.dir === "asc" ? -1 : 1;
        if (va > vb) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [rows, filters, sort]);

  const tiers = React.useMemo(() => Array.from(new Set(rows.map(r => r["Tier"]).filter(Boolean))), [rows]);
  const acts = React.useMemo(() => Array.from(new Set(rows.map(r => r["Act"]).filter(Boolean))), [rows]);

  function handleCSV(file, resetInput) {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (results) => {
        let data = (results.data || []).map(ensureMeta);
        const csvCols = (results.meta?.fields || []).map(normalizeHeader);
        const merged = [...new Set([...csvCols, ...DEFAULT_META_COLS])];
        setColumns(merged);
        setRows(data.map((r) => ({ id: crypto.randomUUID(), ...r })));
        setEditingId(null);
        resetInput?.();
      },
      error: (err) => alert("CSV parse error: " + err),
    });
  }

  function exportCSV() {
    const plain = rows.map(({ id, ...rest }) => rest);
    const csv = Papa.unparse(plain, { columns });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gm_campaign_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    const json = JSON.stringify({ columns, rows, npcLib, setLib, mapLib }, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gm_campaign_export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addRow() {
    const blank = {};
    for (const c of columns) blank[c] = "";
    const rec = ensureMeta({ id: crypto.randomUUID(), ...blank });
    setRows([rec, ...rows]);
    setEditingId(rec.id);
  }
  function deleteRow(id) {
    if (!window.confirm("Delete this entry?")) return;
    setRows(rows.filter((r) => r.id !== id));
  }
  function saveRow(id, updates) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setEditingId(null);
  }
  function clearAll() {
    if (!window.confirm("Clear all data? This cannot be undone.")) return;
    setRows([]);
    setColumns([]);
    setNpcLib([]);
    setSetLib([]);
    setMapLib([]);
    localStorage.removeItem("gm-tracker-data");
  }

  function addNpc({ name, notes, img }) { setNpcLib([{ id: crypto.randomUUID(), name, notes, img }, ...npcLib]); }
  function deleteNpc(id) { if (!window.confirm("Delete NPC?")) return; setNpcLib(npcLib.filter(n => n.id !== id)); }
  function addSet({ name, notes, img }) { setSetLib([{ id: crypto.randomUUID(), name, notes, img }, ...setLib]); }
  function deleteSet(id) { if (!window.confirm("Delete Set?")) return; setSetLib(setLib.filter(s => s.id !== id)); }
  function addMap({ title, notes, img }) { setMapLib([{ id: crypto.randomUUID(), title, notes, img }, ...mapLib]); }
  function deleteMap(id) { if (!window.confirm("Delete Map?")) return; setMapLib(mapLib.filter(m => m.id !== id)); }

  function findNpcByNameToken(token) {
    const t = (token || "").trim().toLowerCase();
    if (!t) return null;
    return npcLib.find(n => (n.name || "").trim().toLowerCase() === t) || null;
  }

  return (
    <div className="min-h-screen text-slate-900">
      <HeaderBar
        view={view}
        setView={setView}
        onAddNew={addRow}
        onExportCSV={exportCSV}
        onExportJSON={exportJSON}
        onReset={clearAll}
      />

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {view === "tracker" && (
          <>
            <UploadBar onUpload={handleCSV} />
            <FiltersBar filters={filters} setFilters={setFilters} tiers={tiers} acts={acts} />
            <StatsBar stats={{
              total: rows.length,
              byStatus: STATUS_OPTIONS.reduce((acc, s) => { acc[s] = rows.filter(r => r.Status === s).length; return acc; }, {})
            }} />
            <SectionsPanel
              columns={columns}
              visibleRows={visibleRows}
              findNpcByNameToken={findNpcByNameToken}
            />
            <DataTable
              columns={columns}
              visibleRows={visibleRows}
              editingId={editingId}
              setEditingId={setEditingId}
              onSave={saveRow}
              onDelete={deleteRow}
            />
          </>
        )}

        {view === "npcs" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <NpcForm onAdd={addNpc} />
            </div>
            <NpcLibrary npcLib={npcLib} onDelete={deleteNpc} />
          </section>
        )}

        {view === "sets" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <SetForm onAdd={addSet} />
            </div>
            <SetLibrary setLib={setLib} onDelete={deleteSet} />
          </section>
        )}

        {view === "maps" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <MapForm onAdd={addMap} />
            </div>
            <MapGallery mapLib={mapLib} onDelete={deleteMap} />
          </section>
        )}
      </main>

      <footer className="max-w-7xl mx-auto p-6 text-xs text-slate-500">
        Local-only app. Import your CSV, manage NPCs/Sets/Maps with images, use collapsible cards and quick links, and export anytime.
      </footer>
    </div>
  );
}
