import React from "react";
import Papa from "papaparse";
import "./styles/base.css";
import "./styles/tabs.css";

import HeaderBar from "./components/HeaderBar";
import TabsNav from "./components/TabsNav";
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
import {
  loadState,
  saveState,
  putBlob,
  getBlob,
  deleteBlob,
} from "./utils/idb";

const DEFAULT_META_COLS = ["Status", "Category"];
const STORAGE_VERSION = 2;

function ensureMeta(record) {
  const r = { ...record };
  for (const k of DEFAULT_META_COLS) if (!(k in r)) r[k] = "";
  return r;
}

export default function App() {
  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [editingId, setEditingId] = React.useState(null);
  const [filters, setFilters] = React.useState({
    search: "",
    Status: "",
    Category: "",
    Tier: "",
    Act: "",
  });
  const [view, setView] = React.useState("tracker");
  const [lastSavedAt, setLastSavedAt] = React.useState(null);
  const [activeViewIndex, setActiveViewIndex] = React.useState(0);

  const [npcLib, setNpcLib] = React.useState([]);
  const [setLib, setSetLib] = React.useState([]);
  const [mapLib, setMapLib] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const persisted = await loadState();
      if (persisted && persisted.columns) {
        const cols = (persisted.columns || []).map(normalizeHeader);
        const merged = [...new Set([...cols, ...DEFAULT_META_COLS])];
        setColumns(merged);
        setRows((persisted.rows || []).map(ensureMeta));
        setNpcLib(persisted.npcLib || []);
        setSetLib(persisted.setLib || []);
        setMapLib(persisted.mapLib || []);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!columns.length) return;
    (async () => {
      await saveState({
        version: STORAGE_VERSION,
        columns,
        rows,
        npcLib,
        setLib,
        mapLib,
      });
      setLastSavedAt(Date.now());
    })();
  }, [columns, rows, npcLib, setLib, mapLib]);

  const visibleRows = React.useMemo(() => {
    let data = [...rows];
    data = data.filter((r) => {
      const txt = Object.values(r).join(" \n ").toLowerCase();
      const okS = !filters.search || txt.includes(filters.search.toLowerCase());
      const ok1 = !filters.Status || (r["Status"] || "") === filters.Status;
      const ok2 =
        !filters.Category || (r["Category"] || "") === filters.Category;
      const ok3 = !filters.Tier || (r["Tier"] || "") === filters.Tier;
      const ok4 = !filters.Act || (r["Act"] || "") === filters.Act;
      return okS && ok1 && ok2 && ok3 && ok4;
    });
    return data;
  }, [rows, filters]);

  const tiers = React.useMemo(
    () => Array.from(new Set(rows.map((r) => r["Tier"]).filter(Boolean))),
    [rows]
  );
  const acts = React.useMemo(
    () => Array.from(new Set(rows.map((r) => r["Act"]).filter(Boolean))),
    [rows]
  );

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

  function exportJSONLight() {
    const json = JSON.stringify(
      { version: STORAGE_VERSION, columns, rows, npcLib, setLib, mapLib },
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gm_campaign_backup_light.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJSONWithImages() {
    async function embedImages(arr) {
      if (!arr) return arr;
      const out = [];
      for (const x of arr) {
        let img = x.img || null;
        if (!img && x.imageKey) {
          const blob = await getBlob(x.imageKey);
          if (blob)
            img = await new Promise((res) => {
              const fr = new FileReader();
              fr.onload = () => res(fr.result);
              fr.readAsDataURL(blob);
            });
        }
        out.push({ ...x, img });
      }
      return out;
    }
    const payload = {
      version: STORAGE_VERSION,
      columns,
      rows,
      npcLib: await embedImages(npcLib),
      setLib: await embedImages(setLib),
      mapLib: await embedImages(mapLib),
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gm_campaign_backup_with_images.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportJSON(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !parsed.columns || !parsed.rows)
          throw new Error("Invalid backup file");
        const cols = (parsed.columns || []).map(normalizeHeader);
        const merged = [...new Set([...cols, ...DEFAULT_META_COLS])];
        setColumns(merged);
        setRows((parsed.rows || []).map(ensureMeta));
        async function toLib(arr, prefix) {
          const out = [];
          for (const x of arr || []) {
            let imageKey = x.imageKey || null;
            if (!imageKey && x.img) {
              imageKey = `${prefix}_${crypto.randomUUID()}`;
              try {
                const blob = await (await fetch(x.img)).blob();
                await putBlob(imageKey, blob);
              } catch {}
            }
            out.push({ ...x, imageKey, img: undefined });
          }
          return out;
        }
        setNpcLib(await toLib(parsed.npcLib, "npc"));
        setSetLib(await toLib(parsed.setLib, "set"));
        setMapLib(await toLib(parsed.mapLib, "map"));
        alert("Backup imported successfully.");
      } catch (e) {
        alert("Import failed: " + e.message);
      }
    };
    reader.onerror = () => alert("Failed to read file.");
    reader.readAsText(file);
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

  async function addNpc({ name, notes, file }) {
    const id = crypto.randomUUID();
    let imageKey = null;
    if (file) {
      imageKey = `npc_${id}`;
      await putBlob(imageKey, file);
    }
    setNpcLib([{ id, name, notes, imageKey }, ...npcLib]);
  }
  function deleteNpc(id) {
    if (!window.confirm("Delete NPC?")) return;
    const target = npcLib.find((n) => n.id === id);
    if (target?.imageKey) deleteBlob(target.imageKey);
    setNpcLib(npcLib.filter((n) => n.id !== id));
  }

  async function addSet({ name, notes, file }) {
    const id = crypto.randomUUID();
    let imageKey = null;
    if (file) {
      imageKey = `set_${id}`;
      await putBlob(imageKey, file);
    }
    setSetLib([{ id, name, notes, imageKey }, ...setLib]);
  }
  function deleteSet(id) {
    if (!window.confirm("Delete Set?")) return;
    const target = setLib.find((s) => s.id === id);
    if (target?.imageKey) deleteBlob(target.imageKey);
    setSetLib(setLib.filter((s) => s.id !== id));
  }

  async function addMap({ title, notes, file }) {
    const id = crypto.randomUUID();
    let imageKey = null;
    if (file) {
      imageKey = `map_${id}`;
      await putBlob(imageKey, file);
    }
    setMapLib([{ id, title, notes, imageKey }, ...mapLib]);
  }
  function deleteMap(id) {
    if (!window.confirm("Delete Map?")) return;
    const target = mapLib.find((m) => m.id === id);
    if (target?.imageKey) deleteBlob(target.imageKey);
    setMapLib(mapLib.filter((m) => m.id !== id));
  }

  return (
    <div>
      <HeaderBar
        view={view}
        setView={setView}
        onAddNew={addRow}
        onExportCSV={exportCSV}
        onExportJSONLight={exportJSONLight}
        onExportJSONWithImages={exportJSONWithImages}
        onImportJSON={onImportJSON}
        onReset={clearAll}
        lastSavedAt={lastSavedAt}
      />

      <main className="container">
        {view === "tracker" && (
          <div className="tabbed-interface">
            <TabsNav
              activeView={activeViewIndex}
              onViewChange={setActiveViewIndex}
              viewNames={[
                "🔍 Filters & Stats",
                "📑 Sections View",
                "📋 Table View",
              ]}
            />
            <div className="view-container">
              {activeViewIndex === 0 && (
                <>
                  <UploadBar onUpload={handleCSV} />
                  <FiltersBar
                    filters={filters}
                    setFilters={setFilters}
                    tiers={tiers}
                    acts={acts}
                  />
                  <StatsBar
                    stats={{
                      total: rows.length,
                      byStatus: STATUS_OPTIONS.reduce((acc, s) => {
                        acc[s] = rows.filter((r) => r.Status === s).length;
                        return acc;
                      }, {}),
                    }}
                  />
                </>
              )}
              {activeViewIndex === 1 && (
                <SectionsPanel columns={columns} visibleRows={visibleRows} />
              )}
              {activeViewIndex === 2 && (
                <DataTable
                  columns={columns}
                  visibleRows={visibleRows}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  onSave={saveRow}
                  onDelete={deleteRow}
                />
              )}
            </div>
          </div>
        )}

        {view === "npcs" && (
          <section className="card">
            <div className="card--tight">
              <NpcForm onAdd={addNpc} />
            </div>
            <div style={{ height: 12 }}></div>
            <NpcLibrary npcLib={npcLib} onDelete={deleteNpc} />
          </section>
        )}

        {view === "sets" && (
          <section className="card">
            <div className="card--tight">
              <SetForm onAdd={addSet} />
            </div>
            <div style={{ height: 12 }}></div>
            <SetLibrary setLib={setLib} onDelete={deleteSet} />
          </section>
        )}

        {view === "maps" && (
          <section className="card">
            <div className="card--tight">
              <MapForm onAdd={addMap} />
            </div>
            <div style={{ height: 12 }}></div>
            <MapGallery mapLib={mapLib} onDelete={deleteMap} />
          </section>
        )}
      </main>

      <footer className="container" style={{ padding: "24px 16px" }}>
        <span className="muted">
          Autosaves to IndexedDB. Use Export (light or with images) for portable
          backups.
        </span>
      </footer>
    </div>
  );
}
