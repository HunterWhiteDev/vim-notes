import FileExplorer from "../components/FileExplorer";
import CommandPallete from "../components/CommandPallete";

export default function Sidebar({
  showPallete,
  openedFileIdx,
  selectedFileIdx,
  files,
  selectedCommandIdx,
  deleteFileIdx,
  confirmingDelete,
}) {
  return showPallete ? (
    <CommandPallete selectedFileIdx={selectedCommandIdx} />
  ) : (
    <FileExplorer
      openedFileIdx={openedFileIdx}
      selectedFileIdx={selectedFileIdx}
      files={files}
      deleteFileIdx={deleteFileIdx}
      confirmingDelete={confirmingDelete}
    />
  );
}
