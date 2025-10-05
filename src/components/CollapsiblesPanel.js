import React from "react";
import "../styles/collapsibles.css";
import CollapsibleColumn from "./CollapsibleColumn";

export default function CollapsiblesPanel({ columns, visibleRows }){
  const excluded = ["Tier","Act"];
  const cols = columns.filter(c => !excluded.some(ex => new RegExp("^"+ex+"$","i").test(c)));

  function expandAll(){ document.querySelectorAll("details.comp").forEach(d => d.open = true); }
  function collapseAll(){ document.querySelectorAll("details.comp").forEach(d => d.open = false); }

  function onGoToRow(rowRef, edit=false){
    const el = document.getElementById(rowRef);
    if (el){
      el.scrollIntoView({ behavior:"smooth", block:"center" });
      el.classList.add("glow");
      setTimeout(()=>el.classList.remove("glow"), 1200);
      if (edit){ const btn = document.getElementById(rowRef + "-edit"); btn?.click(); }
    }
  }

  return (
    <>
      <div className="collapsible-actions">
        <button className="btn" onClick={expandAll}>Expand All</button>
        <button className="btn" onClick={collapseAll}>Collapse All</button>
      </div>
      <section className="row" style={{flexDirection:"column", gap:"12px"}}>
        {cols.map(col => (
          <CollapsibleColumn key={col} col={col} visibleRows={visibleRows} onGoToRow={onGoToRow} />
        ))}
      </section>
    </>
  );
}
