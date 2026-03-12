import { useCallback } from "react";
import LZString from "lz-string";

export function usePermalink(code) {
  // On mount, check URL for encoded diagram
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");
  let initialCode = code;

  if (encoded) {
    try {
      initialCode = LZString.decompressFromEncodedURIComponent(encoded) || code;
    } catch {
      initialCode = code;
    }
  }

  const copyPermalink = useCallback(async () => {
    const compressed = LZString.compressToEncodedURIComponent(code);
    const url = `${window.location.origin}${window.location.pathname}?d=${compressed}`;
    await navigator.clipboard.writeText(url);
  }, [code]);

  return { initialCode, copyPermalink };
}
