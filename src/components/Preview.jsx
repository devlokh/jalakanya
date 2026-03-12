import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

let idCounter = 0;

export default function Preview({ code, theme, onError, onSvgReady }) {
  const containerRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme || "default",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
    });
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
            // Preserve the viewBox (critical for PNG export dimensions)
            // but make display responsive
            const vb = svgEl.getAttribute("viewBox");
            if (!vb) {
              // If no viewBox, create one from the width/height attrs before removing them
              const w = svgEl.getAttribute("width") || "800";
              const h = svgEl.getAttribute("height") || "600";
              svgEl.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
            }
            // Remove fixed dims so CSS controls display size
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

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    />
  );
}
