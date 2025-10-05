import React from "react";

export default function TabsNav({ activeView, onViewChange, viewNames }) {
  return (
    <div className="tabs-nav">
      {viewNames.map((view, index) => (
        <button
          key={index}
          className={`tab-button ${activeView === index ? "active" : ""}`}
          onClick={() => onViewChange(index)}
        >
          {view}
        </button>
      ))}
    </div>
  );
}
