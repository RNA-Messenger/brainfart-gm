import React from "react";
import "../styles/mapgallery.css";
import { useIDBObjectURL } from "../utils/hooks";

function MapCard({ m, onDelete }){
  const url = useIDBObjectURL(m.imageKey);
  return (
    <div className="card map-card">
      <img src={url || ""} alt={m.title}/>
      <div className="row" style={{marginTop:"8px"}}>
        <span>🗺️ <b>{m.title}</b></span>
        <div className="spacer"></div>
        <button className="btn" onClick={()=>onDelete(m.id)}>Delete</button>
      </div>
      <div style={{whiteSpace:"pre-wrap"}}>{m.notes}</div>
    </div>
  );
}

export default function MapGallery({ mapLib, onDelete }){
  return (
    <div className="grid">
      {mapLib.map(m => <MapCard key={m.id} m={m} onDelete={onDelete}/>)}
      {mapLib.length===0 && <div className="muted">No maps yet—add some above.</div>}
    </div>
  );
}
