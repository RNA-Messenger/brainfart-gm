import React from "react";
import "../styles/npclibrary.css";
import { useIDBObjectURL } from "../utils/hooks";

function NpcCard({ n, onDelete }){
  const url = useIDBObjectURL(n.imageKey);
  return (
    <div className="card npc-card">
      <div className="row" style={{alignItems:"center"}}>
        <img className="thumb" src={url || ""} alt={n.name}/>
        <div>
          <div style={{fontWeight:600}}>🧑 {n.name}</div>
          <div className="subtitle">NPC</div>
        </div>
        <div className="spacer"></div>
        <button className="btn" onClick={()=>onDelete(n.id)}>Delete</button>
      </div>
      <div style={{whiteSpace:"pre-wrap"}}>{n.notes}</div>
    </div>
  );
}

export default function NpcLibrary({ npcLib, onDelete }){
  return (
    <div className="grid">
      {npcLib.map(n => <NpcCard key={n.id} n={n} onDelete={onDelete}/>)}
      {npcLib.length===0 && <div className="muted">No NPCs yet—add some above.</div>}
    </div>
  );
}
