export function normalizeHeader(h) { return (h||"").replace(/[’']/g,"'").replace(/\s+/g," ").trim(); }

export const STATUS_OPTIONS = ["Not Started", "In Progress", "Complete"];
export const CATEGORY_OPTIONS = ["MCP", "Enemy", "Check", "Clue", "Location", "NPC", "Other"];

export function emojiFor(col, val="") {
  const c=(col||"").toLowerCase(), v=(val||"").toLowerCase();
  if (c==="status") return v.includes("complete")?"✅":v.includes("progress")?"🚧":"⏳";
  if (c==="category") {
    if (v.includes("mcp")) return "🧭";
    if (v.includes("enemy")) return "👹";
    if (v.includes("check")) return "🎲";
    if (v.includes("clue")) return "🧩";
    if (v.includes("location")) return "🗺️";
    if (v.includes("npc")) return "🧑‍🌾";
    return "📦";
  }
  if (c.includes("clue")) return "🧩";
  if (c.includes("npc stats")||c.includes("checks")) return "🧠";
  if (c==="npcs") return "🧑‍🤝‍🧑";
  if (c.includes("location")||c.includes("set")) return "🗺️";
  if (c.includes("ambience")) return "🎼";
  if (c.includes("crow") && c.includes("role")) return "🐦";
  if (c.includes("consequence")) return "⚠️";
  return "📌";
}
