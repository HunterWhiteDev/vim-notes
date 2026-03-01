import MonacoEditor from "@monaco-editor/react";
import { initVimMode } from "monaco-vim";
import { useRef } from "react";

export default function Editor({ editorRef, fileData, handleFileDataChange }) {
  const statusBarRef = useRef(null);
  const vimRef = useRef(null);
  const mode = useRef(null);

  function handleEditorDidMount(editor) {
    vimRef.current = initVimMode(editor, statusBarRef.current);
    vimRef.current.on("vim-mode-change", (e) => {
      mode.current = e.mode;
    });

    vimRef.current.on("vim-keypress", (e) => {
      console.log({ e, c: mode.current });
      if (mode.current === "normal" && e === "<C-o>") {
        window.document.activeElement.blur();
      }
    });

    editor.focus();
    editorRef.current = editor;
    // editor.onKeyDown((e) => {
    //   console.log({ mode: mode.current, e });
    // });
  }

  return (
    <div className="h-screen w-full">
      <MonacoEditor
        options={{ minimap: { enabled: false } }}
        defaultLanguage="markdown"
        onMount={handleEditorDidMount}
        className="monacoEditor h-full w-full !bg-gray-900"
        theme="vs-dark"
        value={fileData}
        onChange={handleFileDataChange}
      />
      <div
        ref={statusBarRef}
        className="fixed bottom-0 h-8 w-full border-t-2 border-t-white px-4 py-1 text-white"
      ></div>
    </div>
  );
}
