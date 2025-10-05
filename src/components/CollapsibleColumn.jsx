import React from "react";
import { emojiFor, statusClasses, categoryClasses } from "../utils/helpers";

export default function CollapsibleColumn({ col, visibleRows, findNpcByNameToken, onGoToRow }) {
  const cells = visibleRows
    .map((r) => ({ value: r[col], row: r }))
    .filter((c) => (c.value ?? "").toString().trim().length > 0);
  const count = cells.length;
  const icon = emojiFor(col);

  return (
    <details className="group bg-white rounded-2xl shadow-sm border border-slate-200">
      <summary className="cursor-pointer list-none px-4 py-3 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold">{col}</span>
        <span className="text-xs text-slate-500 ml-2">({count} items)</span>
        <span className="ml-auto text-slate-400 group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="px-4 pb-4">
        {count === 0 ? (
          <div className="text-sm text-slate-500 py-3">No data for this column (after filters).</div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {cells.map(({ value, row }) => {
              const statusBadge = row.Status ? <span className={"text-xs px-2 py-1 rounded-full border " + statusClasses(row.Status)}>{emojiFor("status", row.Status)} {row.Status}</span> : null;
              const categoryBadge = row.Category ? <span className={"text-xs px-2 py-1 rounded-full border " + categoryClasses(row.Category)}>{emojiFor("category", row.Category)} {row.Category}</span> : null;
              const rowRef = "row-" + row.id;
              // NPC chips: we don't resolve images here (to keep it tiny); avatar appears in library views
              let npcChips = null;
              if (String(col).toLowerCase() === "npcs") {
                const tokens = String(value).split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
                npcChips = (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tokens.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-300 text-xs bg-white">
                        <span>🧑</span><span>{t}</span>
                      </span>
                    ))}
                  </div>
                );
              }

              return (
                <div key={row.id + col} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emojiFor(col, value)}</span>
                      <span className="text-xs uppercase tracking-wide text-slate-500">{col}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {categoryBadge}
                      {statusBadge}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{String(value)}</div>
                  {npcChips}
                  <div className="mt-3 text-xs flex items-center gap-3 text-slate-500">
                    <a href={"#" + rowRef} onClick={(e) => { e.preventDefault(); onGoToRow(rowRef); }} className="underline">Go to row</a>
                    <button className="underline" onClick={() => onGoToRow(rowRef, true)}>Edit row</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </details>
  );
}
