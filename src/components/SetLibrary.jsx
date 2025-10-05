import React from "react";
import { useIDBObjectURL } from "../utils/hooks";

function SetCard({ s, onDelete }) {
  const url = useIDBObjectURL(s.imageKey);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <img src={url || s.img || ""} alt={s.name} className="w-20 h-16 rounded-xl object-cover bg-slate-100"/>
        <div>
          <div className="font-semibold">🗺️ {s.name}</div>
          <div className="text-xs text-slate-500">Set / Location</div>
        </div>
        <button className="ml-auto text-xs px-2 py-1 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50" onClick={() => onDelete(s.id)}>Delete</button>
      </div>
      <div className="text-sm whitespace-pre-wrap">{s.notes}</div>
    </div>
  );
}

export default function SetLibrary({ setLib, onDelete }) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {setLib.map(s => <SetCard key={s.id} s={s} onDelete={onDelete} />)}
      {setLib.length === 0 && <div className="text-slate-500">No Sets yet—add some above.</div>}
    </div>
  );
}
