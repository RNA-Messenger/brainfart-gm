import React from "react";
import "../styles/table.css";
import TableRow from "./TableRow";

export default function DataTable({ columns, visibleRows, editingId, setEditingId, onSave, onDelete }){
  return (
    <section className="card tablewrap">
      {columns.length===0 ? (
        <div className="muted" style={{padding:"16px", textAlign:"center"}}>
          Upload a CSV to get started, or click <b>New</b> to add your first entry.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map(c => <th key={c}>{c}</th>)}
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(r => (
              <TableRow key={r.id}
                        record={r}
                        rowRefId={"row-"+r.id}
                        columns={columns}
                        editing={editingId===r.id}
                        onEdit={()=>setEditingId(r.id)}
                        onCancel={()=>setEditingId(null)}
                        onDelete={()=>onDelete(r.id)}
                        onSave={(updates)=>onSave(r.id, updates)} />
            ))}
            {visibleRows.length===0 && <tr><td colSpan={columns.length+1} className="muted" style={{textAlign:"center", padding:"16px"}}>No entries match your filters.</td></tr>}
          </tbody>
        </table>
      )}
    </section>
  );
}
