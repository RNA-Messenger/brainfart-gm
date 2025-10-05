import React from "react";
import "../styles/setlibrary.css";
import { useIDBObjectURL } from "../utils/hooks";

function SetCard({ s, onDelete }){
  const url = useIDBObjectURL(s.imageKey);
  return (
    <div className="card set-card">
      <div className="row" style={{alignItems:"center"}}>
        <img className="thumb-80" src={url || ""} alt={s.name}/>
        <div>
          <div style={{fontWeight:600}}>🗺️ {s.name}</div>
          <div className="subtitle">Set / Location</div>
        </div>
        <div className="spacer"></div>
        <button className="btn" onClick={()=>onDelete(s.id)}>Delete</button>
      </div>
      <div style={{whiteSpace:"pre-wrap"}}>{s.notes}</div>
    </div>
  );
}

export default function SetLibrary({ setLib, onDelete }){
  return (
    <div className="grid">
      {setLib.map(s => <SetCard key={s.id} s={s} onDelete={onDelete}/>)}
      {setLib.length===0 && <div className="muted">No Sets yet—add some above.</div>}
    </div>
  );
}
