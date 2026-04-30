import { Ref, RefObject, useEffect, useRef, useState } from "react";
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
import { DebouncedFunc } from "lodash";

interface EditorProps {
  editorRef: RefObject<EditorView | null>;
  fileData: string;
  selectedFileIdx: RefObject<number>;
  handleFileDataChange: DebouncedFunc<(e: string) => Promise<void>>;
}

export default function Editor({
  editorRef,
  fileData,
  handleFileDataChange,
  selectedFileIdx,
}: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!editorRef?.current) return;
    let startState = EditorState.create({
      doc: fileData,
      extensions: [
        markdownExt,
        onUpdate({ onUpdate: handleFileDataChange }),
        EditorView.lineWrapping,
        gutters(),
        lineNumbers(),
        markdown({ base: markdownLanguage }),
        drawSelection(),
        darkTheme,
        vim(),
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
    <div className="">
      <div className="max-h-[96vh] overflow-scroll">
        <div ref={containerRef} className="cursor-text!"></div>
      </div>
      <div className="h-2vh fixed bottom-0 flex w-full items-center border-2 border-white bg-gray-900">
        <div className="px-2">
          alt+escape: focus file explorer | j: move down file | k: move up file
          | enter: select file. | n: new file | d: delete file
        </div>
      </div>
    </div>
  );
}
