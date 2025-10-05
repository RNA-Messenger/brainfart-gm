import React from "react";
import "../styles/cards.css";
import { emojiFor } from "../utils/helpers";

export default function CollapsibleColumn({ col, visibleRows, onGoToRow }) {
  const cells = visibleRows
    .map((r) => ({ value: r[col], row: r }))
    .filter((c) => (c.value ?? "").toString().trim().length > 0);
  const count = cells.length;
  const icon = emojiFor(col);

  return (
    <div className="section-block">
      <div className="section-header">
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <b>{col}</b>&nbsp;
        <span className="muted">({count} items)</span>
      </div>
      <div className="section-content">
        {count === 0 ? (
          <div className="muted" style={{ padding: "8px 0" }}>
            No data for this column (after filters).
          </div>
        ) : (
          <div className="section-cards">
            {cells.map(({ value, row }) => {
              const rowRef = "row-" + row.id;
              let npcChips = null;
              if (String(col).toLowerCase() === "npcs") {
                const tokens = String(value)
                  .split(/[,;\n]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                npcChips = (
                  <div className="row" style={{ marginTop: "6px" }}>
                    {tokens.map((t) => (
                      <span key={t} className="badge">
                        🧑 {t}
                      </span>
                    ))}
                  </div>
                );
              }
              return (
                <div key={row.id + col} className="card">
                  <div className="card-row">
                    <div className="row">
                      <span>{emojiFor(col, value)}</span>
                      <span
                        className="muted"
                        style={{ textTransform: "uppercase" }}
                      >
                        {col}
                      </span>
                    </div>
                    <div className="card-meta">
                      {row.Category && (
                        <span className="badge">
                          {emojiFor("category", row.Category)} {row.Category}
                        </span>
                      )}
                      {row.Status && (
                        <span className="badge">
                          {emojiFor("status", row.Status)} {row.Status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
                    {String(value)}
                  </div>
                  {npcChips}
                  <div className="card-links">
                    <a
                      href={"#" + rowRef}
                      onClick={(e) => {
                        e.preventDefault();
                        onGoToRow(rowRef);
                      }}
                    >
                      Go to row
                    </a>
                    <a
                      href={"#"}
                      onClick={(e) => {
                        e.preventDefault();
                        onGoToRow(rowRef, true);
                      }}
                    >
                      Edit row
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
