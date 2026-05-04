import {
  ChangeEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  gutters,
  lineNumbers,
} from "@codemirror/view";
import markdownExt from "../extensions/markdown";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { vim, Vim, getCM } from "@replit/codemirror-vim";
import darkTheme from "@/extensions/darkTheme";
import onUpdate from "@/extensions/onUpdate";
import { DebouncedFunc } from "lodash";
import { Checkbox } from "@/components/ui/checkbox";

interface EditorProps {
  editorRef: RefObject<EditorView | null>;
  fileData: string;
  selectedFileIdx?: RefObject<number>;
  handleFileDataChange: DebouncedFunc<(e: string) => Promise<void>>;
  vimConfig: RefObject<string>;
}

export default function Editor({
  editorRef,
  fileData,
  handleFileDataChange,
  selectedFileIdx,
  vimConfig,
}: EditorProps) {
  const containerRef = useRef<any>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [useVim, setUseVim] = useState(true);

  const initVim = (vimEnabled: boolean) => {
    let extensionsArr = [
      markdownExt,
      onUpdate({ onUpdate: handleFileDataChange }),
      EditorView.lineWrapping,
      gutters(),
      lineNumbers(),
      markdown({ base: markdownLanguage }),
      drawSelection(),
      darkTheme,
    ];

    if (vimEnabled) extensionsArr.push(vim());

    let startState = EditorState.create({
      doc: fileData,
      extensions: extensionsArr,
    });

    let view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    console.log({ vimConfig: vimConfig.current });

    editorRef.current = view;

    //TODO: Run a loop based on the vim config here maping keys

    view.focus();

    if (!hasMounted) view.focus();
    setHasMounted(true);
  };

  useEffect(() => {
    initVim(useVim);
    return () => {
      editorRef?.current?.destroy();
    };
  }, [selectedFileIdx?.current]);

  const handleVimModeChange = (checkedState: boolean) => {
    setUseVim(checkedState);
    editorRef.current?.destroy();
    initVim(checkedState);
  };

  useEffect(() => {
    Vim.mapclear();
    for (const line of vimConfig.current.split("\n")) {
      const splitArr = line.split(" ");
      if (splitArr[0] === "map") {
        Vim.map(splitArr[1], splitArr[2], splitArr[3]);
      }
    }
  }, [vimConfig.current]);

  return (
    <div className="">
      <div className="max-h-[96vh] overflow-scroll">
        <div ref={containerRef} className="cursor-text!"></div>
      </div>
      <div className="h-2vh fixed bottom-0 flex w-full items-center border border-white bg-gray-900">
        <div className="flex px-2 text-xs">
          <span className="flex items-center border-r pr-1">
            <Checkbox
              onCheckedChange={handleVimModeChange}
              checked={useVim}
              className="mr-1"
            />{" "}
            vim mode
          </span>
          <span className="p-1">
            alt+escape: focus file explorer | j: move down file | k: move up
            file | enter: select file. | n: new file | d: delete file | s:
            toggle settings
          </span>
        </div>
      </div>
    </div>
  );
}
