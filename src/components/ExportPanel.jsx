import React, { useState } from "react";
import { useExport } from "../hooks/useExport";

export default function ExportPanel({ svgRef, code, theme }) {
  const { exportPNG, exportSVG, exporting } = useExport();
  const [scale, setScale] = useState(2);

  return (
    <div className="flex items-center gap-2">
      {/* Scale selector */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Scale:</span>
        <select
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="bg-gray-800 text-gray-200 text-xs rounded px-1.5 py-0.5 border border-gray-700 focus:outline-none"
        >
          <option value={1}>1x</option>
          <option value={2}>2x (HD)</option>
          <option value={3}>3x</option>
          <option value={4}>4x (4K)</option>
        </select>
      </div>

      {/* PNG Export */}
      <button
        disabled={!svgRef || exporting}
        onClick={() => exportPNG(svgRef, scale)}
        className="text-xs px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
      >
        {exporting ? "Exporting..." : "⬇ PNG"}
      </button>

      {/* SVG Export */}
      <button
        disabled={!svgRef}
        onClick={() => exportSVG(svgRef)}
        className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
      >
        ⬇ SVG
      </button>
    </div>
  );
}
