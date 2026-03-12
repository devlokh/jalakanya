import React from "react";
import { usePermalink } from "../hooks/usePermalink";

const THEMES = ["default", "dark", "forest", "neutral", "base"];

const SNIPPETS = [
  {
    key: "flowchart",
    label: "Flowchart",
    code: `flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Do it]\n    B -->|No| D[Skip]\n    C --> E[End]\n    D --> E`,
  },
  {
    key: "sequence",
    label: "Sequence",
    code: `sequenceDiagram\n    Alice->>Bob: Hello Bob!\n    Bob-->>Alice: Hi Alice!\n    Alice->>Bob: How are you?\n    Bob-->>Alice: Great, thanks!`,
  },
  {
    key: "class",
    label: "Class Diagram",
    code: `classDiagram\n    class Animal {\n      +String name\n      +speak() void\n    }\n    class Dog {\n      +fetch() void\n    }\n    Animal <|-- Dog`,
  },
  {
    key: "er",
    label: "ER Diagram",
    code: `erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    PRODUCT ||--o{ LINE-ITEM : "ordered in"`,
  },
  {
    key: "gantt",
    label: "Gantt Chart",
    code: `gantt\n    title Project Plan\n    dateFormat YYYY-MM-DD\n    section Phase 1\n    Design: 2024-01-01, 7d\n    section Phase 2\n    Development: 2024-01-08, 14d`,
  },
  {
    key: "pie",
    label: "Pie Chart",
    code: `pie title Traffic Sources\n    "Organic" : 42\n    "Direct" : 28\n    "Social" : 18\n    "Referral" : 12`,
  },
  {
    key: "state",
    label: "State Diagram",
    code: `stateDiagram-v2\n    [*] --> Idle\n    Idle --> Running : start\n    Running --> Idle : stop\n    Running --> [*] : finish`,
  },
  {
    key: "mindmap",
    label: "Mind Map",
    code: `mindmap\n  root((Project))\n    Frontend\n      React\n      Tailwind\n    Backend\n      Node\n      Database\n    DevOps\n      CI/CD\n      Cloud`,
  },
];

export default function Toolbar({ theme, setTheme, code, darkMode, setDarkMode, onLoadSnippet }) {
  const { copyPermalink } = usePermalink(code);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await copyPermalink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSnippetChange = (e) => {
    const selected = SNIPPETS.find((s) => s.key === e.target.value);
    if (!selected) return;
    if (window.confirm(`Replace current diagram with a ${selected.label} template?`)) {
      onLoadSnippet(selected.code);
    }
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-wrap transition-colors">
      {/* Brand */}
      <span className="text-purple-600 dark:text-purple-400 font-bold text-lg tracking-tight mr-2">
        Jalakanya
      </span>

      {/* Diagram type */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Type:</span>
        <select
          onChange={handleSnippetChange}
          defaultValue=""
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded px-2 py-1 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-purple-500"
        >
          <option value="" disabled>Select type...</option>
          {SNIPPETS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
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
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
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
