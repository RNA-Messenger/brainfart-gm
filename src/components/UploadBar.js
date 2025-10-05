import React from "react";
import "../styles/uploadbar.css";

export default function UploadBar({ onUpload }){
  const ref = React.useRef();
  return (
    <section className="card uploadbar">
      <div className="row">
        <label htmlFor="csvInput" className="btn btn-primary">⭱ Upload CSV</label>
        <input id="csvInput" className="hidden" ref={ref} type="file" accept=".csv"
               onChange={(e)=>onUpload(e.target.files?.[0], ()=>{ if (ref.current) ref.current.value=""; })}/>
        <span className="hint">CSV seeds your table. Your data is autosaved to IndexedDB.</span>
      </div>
    </section>
  );
}
