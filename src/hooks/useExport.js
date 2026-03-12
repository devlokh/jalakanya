import { useState } from "react";
import { toPng } from "html-to-image";

export function useExport() {
  const [exporting, setExporting] = useState(false);

  const exportPNG = async (svgEl, scale = 2) => {
    if (!svgEl) return;
    setExporting(true);

    try {
      // Get natural dimensions from viewBox or fallback to bounding rect
      const vbAttr = svgEl.getAttribute("viewBox");
      let width, height;

      if (vbAttr) {
        const parts = vbAttr.trim().split(/[\s,]+/);
        width = parseFloat(parts[2]);
        height = parseFloat(parts[3]);
      } else {
        const rect = svgEl.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }

      const dataUrl = await toPng(svgEl, {
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: width + "px",
          height: height + "px",
        },
        backgroundColor: "#ffffff",
        pixelRatio: 1,
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `diagram-${scale}x.png`;
      a.click();
    } catch (err) {
      console.error("PNG export failed:", err);
      alert("PNG export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const exportSVG = (svgEl) => {
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true);
    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "diagram.svg";
    a.click();
  };

  return { exportPNG, exportSVG, exporting };
}
