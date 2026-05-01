import FileExplorer from "../components/FileExplorer";
import Settings from "../components/Settings";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Note } from "./Home";

interface SidebarProps {
  showSettings: boolean;
  selectedFileIdx: RefObject<number>;
  files: Note[];
  selectedSettingIdx: number;
  deleteFileIdx: number;
  forceRerender: Dispatch<SetStateAction<number>>;
}

export default function Sidebar({
  showSettings,
  selectedFileIdx,
  files,
  selectedSettingIdx,
  deleteFileIdx,
  forceRerender,
}: SidebarProps) {
  return showSettings ? (
    <Settings selectedSettingIdx={selectedSettingIdx} />
  ) : (
    <FileExplorer
      forceRerender={forceRerender}
      selectedFileIdx={selectedFileIdx}
      files={files}
      deleteFileIdx={deleteFileIdx}
    />
  );
}
