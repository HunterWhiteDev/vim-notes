import MonacoEditor from "@monaco-editor/react";
import { initVimMode } from "monaco-vim";
import { useRef } from "react";

export default function Editor({
  editorRef,
  fileData,
  handleFileDataChange,
}) {
  console.log({ fileData });
  const statusBarRef = useRef(null);
  const vimRef = useRef(null);

  function handleEditorDidMount(editor) {
    vimRef.current = initVimMode(editor, statusBarRef.current);

    editor.focus();
    editorRef.current = editor;
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
