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
    <div className="border-r-gr h-[100vh] border-r-2 text-white">
      <div className="flex items-center justify-around py-1 text-xs">
        n: new file d: delete file
      </div>
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
