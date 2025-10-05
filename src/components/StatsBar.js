import React from "react";
import "../styles/statsbar.css";
import { STATUS_OPTIONS } from "../utils/helpers";

export default function StatsBar({ stats }){
  return (
    <section className="statsbar">
      <div className="card stat">
        <div className="label">Total Entries</div>
        <div className="value">{stats.total}</div>
      </div>
      {STATUS_OPTIONS.map(s => (
        <div key={s} className="card stat">
          <div className="label">{s}</div>
          <div className="value">{stats.byStatus[s] || 0}</div>
        </div>
      ))}
    </section>
  );
}
