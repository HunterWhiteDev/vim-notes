import File from "../components/File";

type FileExplorerProps = {
  openedFileIdx: number;
  selectedFileIdx: number;
  files: string[];
  deleteFileIdx: number;
};

export default function FileExplorer({
  openedFileIdx,
  selectedFileIdx,
  files,
  deleteFileIdx,
}: FileExplorerProps) {
  return (
    <div className="border-r-gr h-[100vh] border-r-2 text-white">
      <div className="flex items-center justify-around border-b-2 border-gray-500 py-1 text-xs">
        n: new file d: delete file
      </div>

      {files.length === 0 ? (
        <div className="mt-2 px-2 text-center text-gray-400">
          You do not have any notes yet.
        </div>
      ) : null}

      {files.map((file, idx) => (
        <File
          deleteFileIdx={deleteFileIdx}
          openedFileIdx={openedFileIdx}
          idx={idx}
          selectedFileIdx={selectedFileIdx}
          file={file}
        />
      ))}
    </div>
  );
}
