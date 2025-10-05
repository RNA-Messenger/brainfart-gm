import React from "react";

export default function UploadBar({ onUpload }) {
  const fileRef = React.useRef();

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 shadow cursor-pointer" htmlFor="csvInput">
            ⭱ Upload CSV
          </label>
          <input
            id="csvInput"
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0], () => { if (fileRef.current) fileRef.current.value = ""; })}
          />
        </div>
        <p className="text-sm text-slate-600">
          CSV seeds your table. Your actual data is autosaved to IndexedDB.
        </p>
      </div>
    </section>
  );
}
