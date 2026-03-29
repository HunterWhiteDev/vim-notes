import MonacoEditor from "@monaco-editor/react";
import { initVimMode } from "monaco-vim";
import { useRef } from "react";

export default function Editor({ editorRef, fileData, handleFileDataChange }) {
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
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          suggest: { showWords: false },
          lineNumbers: "relative",
        }}
        defaultLanguage="markdown"
        onMount={handleEditorDidMount}
        className="monacoEditor h-full w-full !bg-gray-900"
        theme="vs-dark"
        value={fileData}
        onChange={handleFileDataChange}
      />
      <div className="fixed bottom-0 flex w-full items-center border-t-2 border-white bg-gray-900">
        <div
          ref={statusBarRef}
          className="h-8 w-50 border-r-2 border-r-white px-4 py-1 text-white"
        ></div>
        <div className="px-2">
          alt+escape: focus file explorer | j: move down file | k: move up file
          | enter: select file. | n: new file | d: delete file
        </div>
      </div>
    </div>
  );
}
