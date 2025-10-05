import React from "react";
import Papa from "papaparse";
import "./styles/base.css";
import "./styles/tabs.css";

import HeaderBar from "./components/HeaderBar";
import UploadBar from "./components/UploadBar";
import FiltersBar from "./components/FiltersBar";
import StatsBar from "./components/StatsBar";
import SectionsPanel from "./components/SectionsPanel";
import DataTable from "./components/DataTable";
import TabsNav from "./components/TabsNav";
// ... other imports remain the same

export default function App() {
  // ... keep all existing state and functions

  // Add new state for views
  const [activeViewIndex, setActiveViewIndex] = React.useState(0);
  const viewNames = ["Filters & Stats", "Sections", "Table"];

  // Organize the views content
  const viewContents = [
    // View 1: Filters and Stats
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
    </>,
    // View 2: Sections
    <SectionsPanel columns={columns} visibleRows={visibleRows} />,
    // View 3: Table
    <DataTable
      columns={columns}
      visibleRows={visibleRows}
      editingId={editingId}
      setEditingId={setEditingId}
      onSave={saveRow}
      onDelete={deleteRow}
    />,
  ];

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
        {view === "tracker" ? (
          <>
            <TabsNav
              activeView={activeViewIndex}
              onViewChange={setActiveViewIndex}
              viewNames={viewNames}
            />
            <div className="view-container">
              {viewContents[activeViewIndex]}
            </div>
          </>
        ) : view === "npcs" ? (
          <section className="card">
            <div className="card--tight">
              <NpcForm onAdd={addNpc} />
            </div>
            <div style={{ height: 12 }}></div>
            <NpcLibrary npcLib={npcLib} onDelete={deleteNpc} />
          </section>
        ) : view === "sets" ? (
          <section className="card">
            <div className="card--tight">
              <SetForm onAdd={addSet} />
            </div>
            <div style={{ height: 12 }}></div>
            <SetLibrary setLib={setLib} onDelete={deleteSet} />
          </section>
        ) : (
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
