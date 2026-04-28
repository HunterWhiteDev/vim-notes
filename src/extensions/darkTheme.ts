import { EditorView } from "codemirror";

//TODO: Fix cursor when editor is not focused showing pink outline or border
const darkTheme = EditorView.theme({
  ".cm-content": {
    text: "white",
    "white-space": "pre-wrap !important",
    height: "calc(100vh - 1rem)",
  },
  ".cm-gutters": {
    border: "none !important",
  },
  ".cm-gutter, .cm-gutterElement": {
    background: "var(--color-gray-900)",
    text: "white !important",
  },
  ".cm-cursor-primary": {
    background: "rgba(255, 255, 255, 0.35) !important",
  },
  ".cm-selectionBackground": {
    background: "var(--color-gray-800) !important",
  },
});

export default darkTheme;
