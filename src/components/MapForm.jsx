import React from "react";

export default function MapForm({ onAdd }) {
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const fileRef = React.useRef();

  async function handleAdd() {
    if (!title) return alert("Title is required");
    const file = fileRef.current?.files?.[0] || null;
    if (!file) return alert("Please choose a map image");
    onAdd({ title, notes, file });
    setTitle(""); setNotes(""); if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex gap-3 items-end flex-wrap">
      <div className="grow">
        <label className="block text-xs text-slate-500 mb-1">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" placeholder="Map title"/>
      </div>
      <div className="grow">
        <label className="block text-xs text-slate-500 mb-1">Notes</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" placeholder="Brief notes or tags"/>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Image</label>
        <input type="file" accept="image/*" ref={fileRef}/>
      </div>
      <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-slate-900 text-white">Add Map</button>
    </div>
  );
}
