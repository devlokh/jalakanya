import React from "react";
import { usePermalink } from "../hooks/usePermalink";

const THEMES = ["default", "dark", "forest", "neutral", "base"];

const SNIPPETS = {
  flowchart: `flowchart TD\n    A[Start] --> B[Process]\n    B --> C[End]`,
  sequence: `sequenceDiagram\n    Alice->>Bob: Hello Bob!\n    Bob-->>Alice: Hi Alice!`,
  classDiagram: `classDiagram\n    class Animal {\n      +name: string\n      +speak()\n    }`,
  erDiagram: `erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains`,
  gantt: `gantt\n    title Project Plan\n    dateFormat YYYY-MM-DD\n    section Phase 1\n    Task A: 2024-01-01, 7d`,
  pie: `pie title Distribution\n    "A" : 40\n    "B" : 35\n    "C" : 25`,
};

export default function Toolbar({ theme, setTheme, code, darkMode, setDarkMode }) {
  const { copyPermalink } = usePermalink(code);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await copyPermalink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-wrap transition-colors">
      {/* Brand */}
      <span className="text-purple-600 dark:text-purple-400 font-bold text-lg tracking-tight mr-2">
        MermaidFlow
      </span>

      {/* Diagram type */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Type:</span>
        <select
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded px-2 py-1 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-purple-500"
          onChange={(e) => {
            if (e.target.value && window.confirm("Replace current diagram with template?")) {
              window.dispatchEvent(new CustomEvent("loadSnippet", { detail: SNIPPETS[e.target.value] }));
            }
            e.target.value = "";
          }}
          defaultValue=""
        >
          <option value="" disabled>Select type...</option>
          {Object.keys(SNIPPETS).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {/* Theme picker */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Theme:</span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded px-2 py-1 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-purple-500"
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex-1" />

      {/* Share */}
      <button
        onClick={handleCopy}
        className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 transition-colors"
      >
        {copied ? "✓ Copied!" : "🔗 Share"}
      </button>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 transition-colors"
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}
