import React, { useState, useCallback, useEffect } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";
import ExportPanel from "./components/ExportPanel";
import { usePermalink } from "./hooks/usePermalink";

const DEFAULT_DIAGRAM = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Ship it 🚀]`;

export default function App() {
  const { initialCode } = usePermalink(DEFAULT_DIAGRAM);
  const [code, setCode] = useState(initialCode);
  const [theme, setTheme] = useState("default");
  const [error, setError] = useState(null);
  const [svgRef, setSvgRef] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Apply/remove dark class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleCodeChange = useCallback((val) => {
    setCode(val);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Toolbar
        theme={theme}
        setTheme={setTheme}
        code={code}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Editor pane */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            Editor
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor code={code} onChange={handleCodeChange} darkMode={darkMode} />
          </div>
          {error && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/40 border-t border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm font-mono">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Preview pane */}
        <div className="w-1/2 flex flex-col">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <span>Preview</span>
            <ExportPanel svgRef={svgRef} code={code} theme={theme} />
          </div>
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
            <Preview
              code={code}
              theme={theme}
              onError={setError}
              onSvgReady={setSvgRef}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 flex justify-between">
        <span>Matsyachitra – Open Source & Free Forever</span>
        <a
          href="https://github.com/devlokh/jalakanya"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
        >
          ⭐ Star on GitHub
        </a>
      </div>
    </div>
  );
}
