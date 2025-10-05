import React from "react";
import "../styles/collapsibles.css";
import SectionBlock from "./SectionBlock";

export default function SectionsPanel({ columns, visibleRows }) {
  const excluded = ["Tier", "Act"];
  const cols = columns.filter(
    (c) => !excluded.some((ex) => new RegExp("^" + ex + "$", "i").test(c))
  );

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
    <section className="columns-grid">
      {cols.map((col) => (
        <SectionBlock
          key={col}
          col={col}
          visibleRows={visibleRows}
          onGoToRow={onGoToRow}
        />
      ))}
    </section>
  );
}
