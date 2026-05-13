import FileExplorer from "../components/FileExplorer";
import Settings from "../components/Settings";
import { Dispatch, RefObject, SetStateAction } from "react";
import { FocusedElement, Note } from "./Home";
import { DisplayElement } from "@/lib/directoryMap";

interface SidebarProps {
  showSettings: boolean;
  selectedFileIdx: RefObject<number>;
  selectedSettingIdx: number;
  deleteFileIdx: RefObject<number>;
  forceRerender: Dispatch<SetStateAction<number>>;
  files: DisplayElement[];
  focusedElement: FocusedElement;
  openFolders: Set<number>;
  creatingFileIdx: RefObject<number>;
  creatingFilePath: RefObject<string>;
  ignoreInput: RefObject<boolean>;
  confirmingDelete: RefObject<boolean>;
}

export default function Sidebar({
  showSettings,
  selectedFileIdx,
  files,
  selectedSettingIdx,
  openFolders,
  creatingFileIdx,
  creatingFilePath,
  forceRerender,
  ignoreInput,
  confirmingDelete,
}: SidebarProps) {
  return showSettings ? (
    <Settings selectedSettingIdx={selectedSettingIdx} />
  ) : (
    <FileExplorer
      forceRerender={forceRerender}
      creatingFileIdx={creatingFileIdx}
      selectedFileIdx={selectedFileIdx}
      files={files}
      openFolders={openFolders}
      creatingFilePath={creatingFilePath}
      ignoreInput={ignoreInput}
      confirmingDelete={confirmingDelete}
    />
  );
}
