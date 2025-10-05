import React from "react";
import { STATUS_OPTIONS } from "../utils/helpers";

export default function StatsBar({ stats }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="text-sm text-slate-500">Total Entries</div>
        <div className="text-2xl font-bold">{stats.total}</div>
      </div>
      {STATUS_OPTIONS.map((s) => (
        <div key={s} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-500">{s}</div>
          <div className="text-2xl font-bold">{stats.byStatus[s]}</div>
        </div>
      ))}
    </section>
  );
}
