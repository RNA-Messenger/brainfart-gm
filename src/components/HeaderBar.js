import React from "react";
import "../styles/headerbar.css";

export default function HeaderBar({ view, setView, onAddNew, onExportCSV, onExportJSONLight, onExportJSONWithImages, onImportJSON, onReset, lastSavedAt }){
  const importRef = React.useRef();

  return (
    <header className="app-header">
      <div className="container inner">
        <div className="headerbar__brand">GM Campaign Tracker</div>
        <span className="muted">Local-only. IndexedDB persistence.</span>

        <nav className="headerbar__tabs">
          {["tracker","npcs","sets","maps"].map(v => (
            <button key={v} className={"btn" + (view===v ? " btn-primary" : "")} onClick={()=>setView(v)}>
              {v==="tracker" ? "Tracker" : v.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="spacer"></div>
        <div className="headerbar__right">
          {view==="tracker" && (
            <button className="btn btn-primary" onClick={onAddNew}>＋ New</button>
          )}
          <button className="btn" onClick={()=>importRef.current?.click()}>⬆ Import JSON</button>
          <input ref={importRef} type="file" accept="application/json" className="hidden"
                 onChange={(e)=>{ if(e.target.files?.[0]) onImportJSON(e.target.files[0]); e.target.value=""; }}/>
          <button className="btn" onClick={onExportJSONWithImages}>⬇ Export JSON + Images</button>
          <button className="btn" onClick={onExportJSONLight}>⬇ Export JSON (light)</button>
          <button className="btn" onClick={onExportCSV}>⬇ CSV</button>
          <button className="btn" onClick={onReset}>⟲ Reset</button>
        </div>

        <div className="muted" style={{marginLeft:8}}>
          {lastSavedAt ? <>Saved: <b>{new Date(lastSavedAt).toLocaleTimeString()}</b></> : "Autosave ready"}
        </div>
      </div>
    </header>
  );
}
