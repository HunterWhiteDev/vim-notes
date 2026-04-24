import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  gutters,
  lineNumbers,
} from "@codemirror/view";
import markdownExt from "../extensions/markdown";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { vim } from "@replit/codemirror-vim";
import darkTheme from "@/extensions/darkTheme";
import onUpdate from "@/extensions/onUpdate";

export default function Editor({
  editorRef,
  fileData,
  handleFileDataChange,
  selectedFileIdx,
}) {
  const statusBarRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    let startState = EditorState.create({
      doc: fileData,
      extensions: [
        vim(),
        onUpdate({ onUpdate: handleFileDataChange }),
        EditorView.lineWrapping,
        gutters(),
        lineNumbers(),
        markdownExt,
        markdown({ base: markdownLanguage }),
        drawSelection(),
        darkTheme,
      ],
    });

    let view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    editorRef.current = view;

    if (!hasMounted) view.focus();
    setHasMounted(true);

    return () => {
      view.destroy();
    };
  }, [selectedFileIdx.current]);

  return (
    <div className="h-screen">
      <div ref={containerRef} className="h-full cursor-text!"></div>
      <div className="fixed bottom-0 flex w-full items-center border-2 border-white bg-gray-900">
        {/* <div */}
        {/*   ref={statusBarRef} */}
        {/*   className="h-8 w-50 border-r-2 border-r-white px-4 py-1 text-white" */}
        {/* ></div> */}
        <div className="px-2">
          alt+escape: focus file explorer | j: move down file | k: move up file
          | enter: select file. | n: new file | d: delete file
        </div>
      </div>
    </div>
  );
}
