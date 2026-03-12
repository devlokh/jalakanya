import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { markdown } from "@codemirror/lang-markdown";

export default function Editor({ code, onChange, darkMode }) {
  return (
    <CodeMirror
      value={code}
      height="100%"
      theme={darkMode ? oneDark : "light"}
      extensions={[markdown()]}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        autocompletion: true,
        bracketMatching: true,
      }}
      style={{ height: "100%", fontSize: "14px" }}
    />
  );
}
