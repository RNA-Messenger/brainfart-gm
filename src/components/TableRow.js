import React from "react";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "../utils/helpers";

export default function TableRow({ record, columns, editing, onEdit, onCancel, onDelete, onSave, rowRefId }){
  const [draft, setDraft] = React.useState(record);
  React.useEffect(()=> setDraft(record), [record]);

  return (
    <tr id={rowRefId} className="hover">
      {columns.map((c) => (
        <td key={c}>
          {editing ? (
            c === "Status" ? (
              <select value={draft[c] || ""} onChange={(e)=>setDraft({ ...draft, [c]: e.target.value })}>
                <option value=""></option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : c === "Category" ? (
              <select value={draft[c] || ""} onChange={(e)=>setDraft({ ...draft, [c]: e.target.value })}>
                <option value=""></option>
                {CATEGORY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <textarea value={draft[c] ?? ""} onChange={(e)=>setDraft({ ...draft, [c]: e.target.value })}
                        rows={Math.min(8, String(draft[c] ?? "").split("\n").length)} placeholder={c}/>
            )
          ) : (
            <div style={{whiteSpace:"pre-wrap"}}>{String(record[c] ?? "")}</div>
          )}
        </td>
      ))}
      <td className="table-actions">
        {editing ? (
          <div className="row">
            <button className="btn" onClick={()=>onSave(draft)}>✔ Save</button>
            <button className="btn" onClick={onCancel}>✖ Cancel</button>
          </div>
        ) : (
          <div className="row">
            <button id={rowRefId + "-edit"} className="btn" onClick={onEdit}>✎ Edit</button>
            <button className="btn" onClick={onDelete}>🗑 Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}
