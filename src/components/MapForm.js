import React from "react";
import "../styles/forms.css";

export default function MapForm({ onAdd }){
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const ref = React.useRef();

  async function handle(){
    if (!title) return alert("Title is required");
    const file = ref.current?.files?.[0] || null;
    if (!file) return alert("Please choose a map image");
    onAdd({ title, notes, file });
    setTitle(""); setNotes(""); if (ref.current) ref.current.value = "";
  }

  return (
    <div className="form-row">
      <div className="form-col">
        <label className="form-label">Title</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Map title"/>
      </div>
      <div className="form-col">
        <label className="form-label">Notes</label>
        <input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Brief notes or tags"/>
      </div>
      <div>
        <label className="form-label">Image</label>
        <input type="file" accept="image/*" ref={ref}/>
      </div>
      <button className="btn btn-primary" onClick={handle}>Add Map</button>
    </div>
  );
}
