import File from "../components/File";

type FileExplorerProps = {
  openedFileIdx: number;
  selectedFileIdx: number;
  files: string[];
};

export default function FileExplorer({
  openedFileIdx,
  selectedFileIdx,
  files,
}: FileExplorerProps) {
  return (
    <div className="border-r-gr h-[100vh] border-r-2">
      {files.map((file, idx) => (
        <File
          openedFileIdx={openedFileIdx}
          idx={idx}
          selectedFileIdx={selectedFileIdx}
          file={file}
        />
      ))}
    </div>
  );
}
