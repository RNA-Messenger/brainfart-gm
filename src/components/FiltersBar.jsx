import React from "react";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "../utils/helpers";

export default function FiltersBar({ filters, setFilters, tiers, acts }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-slate-500">Filters</span>
        <input
          placeholder="Search everything…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-64 px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <select className="px-3 py-2 rounded-xl border border-slate-300" value={filters.Status} onChange={(e) => setFilters({ ...filters, Status: e.target.value })}>
          <option value="">Status: Any</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="px-3 py-2 rounded-xl border border-slate-300" value={filters.Category} onChange={(e) => setFilters({ ...filters, Category: e.target.value })}>
          <option value="">Category: Any</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="px-3 py-2 rounded-xl border border-slate-300" value={filters.Tier} onChange={(e) => setFilters({ ...filters, Tier: e.target.value })}>
          <option value="">Tier: Any</option>
          {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="px-3 py-2 rounded-xl border border-slate-300" value={filters.Act} onChange={(e) => setFilters({ ...filters, Act: e.target.value })}>
          <option value="">Act: Any</option>
          {acts.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <button
          onClick={() => setFilters({ search: "", Status: "", Category: "", Tier: "", Act: "" })}
          className="ml-auto px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>
    </section>
  );
}
