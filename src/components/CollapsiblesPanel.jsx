import React from "react";
import CollapsibleColumn from "./CollapsibleColumn";

export default function CollapsiblesPanel({ columns, visibleRows, findNpcByNameToken, excludedHeaders = ["Tier","Act"] }) {
  const cols = columns.filter(c => !excludedHeaders.some(ex => new RegExp(`^${ex}$`, "i").test(c)));

  function expandAll() {
    document.querySelectorAll("details").forEach(d => d.open = true);
  }
  function collapseAll() {
    document.querySelectorAll("details").forEach(d => d.open = false);
  }

  function onGoToRow(rowRef, edit = false) {
    const el = document.getElementById(rowRef);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("glow");
      setTimeout(() => el.classList.remove("glow"), 1200);
      if (edit) {
        const btn = document.getElementById(rowRef + "-edit");
        btn?.click();
      }
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button onClick={expandAll} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">Expand All</button>
        <button onClick={collapseAll} className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50">Collapse All</button>
      </div>

      <section className="space-y-3">
        {cols.map((col) => (
          <CollapsibleColumn
            key={col}
            col={col}
            visibleRows={visibleRows}
            findNpcByNameToken={findNpcByNameToken}
            onGoToRow={onGoToRow}
          />
        ))}
      </section>
    </>
  );
}
