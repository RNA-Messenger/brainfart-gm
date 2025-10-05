import React from "react";
import TableRow from "./TableRow";

export default function DataTable({ columns, visibleRows, editingId, setEditingId, onSave, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-auto">
      {columns.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          Upload a CSV to get started, or click <span className="font-medium">New</span> to add your first entry.
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              {columns.map((c) => (
                <th key={c} className="text-left px-3 py-2 font-semibold text-slate-700">
                  {c}
                </th>
              ))}
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r) => (
              <TableRow
                key={r.id}
                record={r}
                rowRefId={"row-" + r.id}
                columns={columns}
                editing={editingId === r.id}
                onEdit={() => setEditingId(r.id)}
                onCancel={() => setEditingId(null)}
                onDelete={() => onDelete(r.id)}
                onSave={(updates) => onSave(r.id, updates)}
              />
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-slate-500">No entries match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
