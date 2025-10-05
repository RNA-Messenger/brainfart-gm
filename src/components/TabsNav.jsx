import React from "react";

export default function TabsNav({ activeView, onViewChange, viewNames }) {
  return (
    <nav className="tabs-nav">
      {viewNames.map((name, index) => (
        <button
          key={index}
          className={`tab-button ${activeView === index ? "active" : ""}`}
          onClick={() => onViewChange(index)}
        >
          {name}
        </button>
      ))}
    </nav>
  );
}