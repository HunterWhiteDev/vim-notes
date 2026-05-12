import FileExplorer from "../components/FileExplorer";
import Settings from "../components/Settings";
import { Dispatch, RefObject, SetStateAction } from "react";
import { DisplayElement } from "./Home";

interface SidebarProps {
  showSettings: boolean;
  selectedFileIdx: RefObject<number>;
  selectedSettingIdx: number;
  deleteFileIdx: number;
  forceRerender: Dispatch<SetStateAction<number>>;
  files: RefObject<DisplayElement[]>;
}

export default function Sidebar({
  showSettings,
  selectedFileIdx,
  files,
  selectedSettingIdx,
}: SidebarProps) {
  return showSettings ? (
    <Settings selectedSettingIdx={selectedSettingIdx} />
  ) : (
    <FileExplorer selectedFileIdx={selectedFileIdx} files={files} />
  );
}
