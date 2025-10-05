import React from "react";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "../utils/helpers";

export default function TableRow({ record, columns, editing, onEdit, onCancel, onDelete, onSave, rowRefId }) {
  const [draft, setDraft] = React.useState(record);
  React.useEffect(() => setDraft(record), [record]);

  return (
    <tr id={rowRefId} className="border-t border-slate-200 hover:bg-slate-50/60 scroll-mt-20">
      {columns.map((c) => (
        <td key={c} className="align-top px-3 py-2">
          {editing ? (
            c === "Status" ? (
              <select
                value={draft[c] || ""}
                onChange={(e) => setDraft({ ...draft, [c]: e.target.value })}
                className="w-full px-2 py-1 rounded-lg border border-slate-300"
              >
                <option value=""></option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : c === "Category" ? (
              <select
                value={draft[c] || ""}
                onChange={(e) => setDraft({ ...draft, [c]: e.target.value })}
                className="w-full px-2 py-1 rounded-lg border border-slate-300"
              >
                <option value=""></option>
                {CATEGORY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <textarea
                value={draft[c] ?? ""}
                onChange={(e) => setDraft({ ...draft, [c]: e.target.value })}
                className="w-full px-2 py-1 rounded-lg border border-slate-300 min-h-[2.25rem]"
                rows={Math.min(8, String(draft[c] ?? "").split("\n").length)}
                placeholder={c}
              />
            )
          ) : (
            <div className="whitespace-pre-wrap">{String(record[c] ?? "")}</div>
          )}
        </td>
      ))}
      <td className="px-3 py-2 text-right whitespace-nowrap">
        {editing ? (
          <div className="inline-flex items-center gap-2">
            <button className="px-2 py-1 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 inline-flex items-center gap-1" onClick={() => onSave(draft)}>✔ Save</button>
            <button className="px-2 py-1 rounded-xl border border-slate-300 hover:bg-slate-100 inline-flex items-center gap-1" onClick={onCancel}>✖ Cancel</button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2">
            <button id={rowRefId + "-edit"} className="px-2 py-1 rounded-xl border border-slate-300 hover:bg-slate-100 inline-flex items-center gap-1" onClick={onEdit}>✎ Edit</button>
            <button className="px-2 py-1 rounded-xl border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 inline-flex items-center gap-1" onClick={onDelete}>🗑 Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}
