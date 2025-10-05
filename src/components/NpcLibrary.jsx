import React from "react";
import { useIDBObjectURL } from "../utils/hooks";

function NpcCard({ n, onDelete }) {
  const url = useIDBObjectURL(n.imageKey);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <img src={url || n.img || ""} alt={n.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100"/>
        <div>
          <div className="font-semibold">🧑 {n.name}</div>
          <div className="text-xs text-slate-500">NPC</div>
        </div>
        <button className="ml-auto text-xs px-2 py-1 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50" onClick={() => onDelete(n.id)}>Delete</button>
      </div>
      <div className="text-sm whitespace-pre-wrap">{n.notes}</div>
    </div>
  );
}

export default function NpcLibrary({ npcLib, onDelete }) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {npcLib.map(n => <NpcCard key={n.id} n={n} onDelete={onDelete} />)}
      {npcLib.length === 0 && <div className="text-slate-500">No NPCs yet—add some above.</div>}
    </div>
  );
}
