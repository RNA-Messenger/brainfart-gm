import React from "react";

export default function SetForm({ onAdd }) {
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const fileRef = React.useRef();

  async function handleAdd() {
    if (!name) return alert("Name is required");
    const file = fileRef.current?.files?.[0] || null;
    onAdd({ name, notes, file });
    setName(""); setNotes(""); if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex gap-3 items-end flex-wrap">
      <div className="grow">
        <label className="block text-xs text-slate-500 mb-1">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" placeholder="Set / Location name"/>
      </div>
      <div className="grow">
        <label className="block text-xs text-slate-500 mb-1">Notes</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" placeholder="Brief notes"/>
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Image</label>
        <input type="file" accept="image/*" ref={fileRef}/>
      </div>
      <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-slate-900 text-white">Add Set</button>
    </div>
  );
}
