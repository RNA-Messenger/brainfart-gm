import React from "react";
import "../styles/filtersbar.css";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "../utils/helpers";

export default function FiltersBar({ filters, setFilters, tiers, acts }){
  return (
    <section className="card filtersbar row">
      <span className="muted">Filters</span>
      <input className="search" placeholder="Search…" value={filters.search}
             onChange={(e)=>setFilters({ ...filters, search:e.target.value })}/>
      <select value={filters.Status} onChange={(e)=>setFilters({ ...filters, Status:e.target.value })}>
        <option value="">Status: Any</option>
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={filters.Category} onChange={(e)=>setFilters({ ...filters, Category:e.target.value })}>
        <option value="">Category: Any</option>
        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.Tier} onChange={(e)=>setFilters({ ...filters, Tier:e.target.value })}>
        <option value="">Tier: Any</option>
        {tiers.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select value={filters.Act} onChange={(e)=>setFilters({ ...filters, Act:e.target.value })}>
        <option value="">Act: Any</option>
        {acts.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      <button className="btn" onClick={()=>setFilters({ search:"", Status:"", Category:"", Tier:"", Act:"" })}>Clear</button>
    </section>
  );
}
