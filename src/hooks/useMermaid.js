import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

export function useMermaid(code, theme) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: theme || "default", securityLevel: "loose" });
  }, [theme]);

  useEffect(() => {
    if (!code?.trim()) return;
    const timer = setTimeout(async () => {
      try {
        setError(null);
        const id = `m-${Date.now()}`;
        const { svg: rendered } = await mermaid.render(id, code);
        setSvg(rendered);
      } catch (err) {
        setError(err.message);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [code, theme]);

  return { svg, error };
}
