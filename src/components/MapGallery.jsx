import React from "react";
import { useIDBObjectURL } from "../utils/hooks";

function MapCard({ m, onDelete }) {
  const url = useIDBObjectURL(m.imageKey);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <img src={url || m.img || ""} alt={m.title} className="w-full h-56 object-cover bg-slate-100"/>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span>🗺️</span><div className="font-semibold">{m.title}</div>
          <button className="ml-auto text-xs px-2 py-1 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50" onClick={() => onDelete(m.id)}>Delete</button>
        </div>
        <div className="text-sm whitespace-pre-wrap mt-2">{m.notes}</div>
      </div>
    </div>
  );
}

export default function MapGallery({ mapLib, onDelete }) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {mapLib.map(m => <MapCard key={m.id} m={m} onDelete={onDelete} />)}
      {mapLib.length === 0 && <div className="text-slate-500">No maps yet—add some above.</div>}
    </div>
  );
}
