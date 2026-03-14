import FileExplorer from "../components/FileExplorer";
import CommandPallete from "../components/CommandPallete";

export default function Sidebar({
  showPallete,
  openedFileIdx,
  selectedFileIdx,
  files,
  selectedCommandIdx,
}) {
  return showPallete ? (
    <CommandPallete selectedFileIdx={selectedCommandIdx} />
  ) : (
    <FileExplorer
      openedFileIdx={openedFileIdx}
      selectedFileIdx={selectedFileIdx}
      files={files}
    />
  );
}
