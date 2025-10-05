import React from "react";
import "../styles/forms.css";

export default function NpcForm({ onAdd }){
  const [name, setName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const ref = React.useRef();

  async function handle(){
    if (!name) return alert("Name is required");
    const file = ref.current?.files?.[0] || null;
    onAdd({ name, notes, file });
    setName(""); setNotes(""); if (ref.current) ref.current.value = "";
  }

  return (
    <div className="form-row">
      <div className="form-col">
        <label className="form-label">Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="NPC name"/>
      </div>
      <div className="form-col">
        <label className="form-label">Notes</label>
        <input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Brief notes"/>
      </div>
      <div>
        <label className="form-label">Picture</label>
        <input type="file" accept="image/*" ref={ref}/>
      </div>
      <button className="btn btn-primary" onClick={handle}>Add NPC</button>
    </div>
  );
}
