import FileExplorer from "../components/FileExplorer";
import CommandPallete from "../components/CommandPallete";
import { Dispatch, Ref, RefObject, SetStateAction } from "react";
import { Note } from "./Home";

interface SidebarProps {
  showPallete: boolean;
  selectedFileIdx: RefObject<number>;
  files: Note[];
  selectedCommandIdx: number;
  deleteFileIdx: number;
  forceRerender: Dispatch<SetStateAction<number>>;
}

export default function Sidebar({
  showPallete,
  selectedFileIdx,
  files,
  selectedCommandIdx,
  deleteFileIdx,
  forceRerender,
}: SidebarProps) {
  return showPallete ? (
    <CommandPallete selectedFileIdx={selectedCommandIdx} />
  ) : (
    <FileExplorer
      forceRerender={forceRerender}
      selectedFileIdx={selectedFileIdx}
      files={files}
      deleteFileIdx={deleteFileIdx}
    />
  );
}
