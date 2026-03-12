import React, { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import logos from "@iconify-json/logos/icons.json";
import mdi from "@iconify-json/mdi/icons.json";
import aws from "@iconify-json/aws/icons.json";

let idCounter = 0;

export default function Preview({ code, theme, onError, onSvgReady }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [handTool, setHandTool] = useState(false);
  const lastPos = useRef(null);

  // Re-render diagram when code/theme changes
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme || "default",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
    });

    mermaid.registerIconPacks([
      { name: "logos", icons: logos },
      { name: "mdi", icons: mdi },
      { name: "aws", icons: aws },
    ]);
  }, [theme]);


  useEffect(() => {
    if (!containerRef.current || !code.trim()) return;
    const render = async () => {
      try {
        onError(null);
        const id = `mermaid-render-${++idCounter}`;
        const { svg } = await mermaid.render(id, code);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            const vb = svgEl.getAttribute("viewBox");
            if (!vb) {
              const w = svgEl.getAttribute("width") || "800";
              const h = svgEl.getAttribute("height") || "600";
              svgEl.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
            }
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.width = "100%";
            svgEl.style.height = "100%";
            svgEl.style.maxWidth = "100%";
            svgEl.style.maxHeight = "100%";
            onSvgReady(svgEl);
          }
        }
      } catch (err) {
        onError(err.message || "Invalid diagram syntax");
        if (containerRef.current) containerRef.current.innerHTML = "";
      }
    };
    const timer = setTimeout(render, 300);
    return () => clearTimeout(timer);
  }, [code, theme, onError, onSvgReady]);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(Math.max(0.2, s + delta), 5));
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Pan with mouse drag (when hand tool active)
  const handleMouseDown = useCallback((e) => {
    if (!handTool) return;
    setIsPanning(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [handTool]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning || !lastPos.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    lastPos.current = null;
  }, []);

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Zoom/Pan toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-xs">
        {/* Hand tool toggle */}
        <button
          onClick={() => setHandTool(!handTool)}
          title="Hand tool (drag to pan)"
          className={`px-2 py-1 rounded border transition-colors font-medium ${handTool
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
        >
          ✋ Pan
        </button>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />

        {/* Zoom out */}
        <button
          onClick={() => setScale((s) => Math.max(0.2, +(s - 0.25).toFixed(2)))}
          className="w-7 h-7 flex items-center justify-center rounded border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold text-base"
          title="Zoom out"
        >−</button>

        {/* Scale display */}
        <span className="w-12 text-center text-gray-600 dark:text-gray-400 font-mono select-none">
          {Math.round(scale * 100)}%
        </span>

        {/* Zoom in */}
        <button
          onClick={() => setScale((s) => Math.min(5, +(s + 0.25).toFixed(2)))}
          className="w-7 h-7 flex items-center justify-center rounded border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-bold text-base"
          title="Zoom in"
        >+</button>

        {/* Fit to screen */}
        <button
          onClick={resetView}
          className="px-2 py-1 rounded border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Reset zoom and position"
        >
          ⊡ Fit
        </button>

        <div className="flex-1" />
        <span className="text-gray-400 dark:text-gray-600 hidden sm:block">Scroll to zoom</span>
      </div>

      {/* Diagram canvas */}
      <div
        ref={wrapperRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1,
          overflow: "hidden",
          cursor: handTool ? (isPanning ? "grabbing" : "grab") : "default",
          position: "relative",
        }}
      >
        <div
          ref={containerRef}
          style={{
            transformOrigin: "center center",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transition: isPanning ? "none" : "transform 0.1s ease",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
