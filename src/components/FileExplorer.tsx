import File from "../components/File";

type FileExplorerProps = {
  openedFileIdx: number;
  selectedFileIdx: number;
  files: string[];
  deleteFileIdx: number;
};

export default function FileExplorer({
  forceRerender,
  openedFileIdx,
  selectedFileIdx,
  files,
  deleteFileIdx,
}: FileExplorerProps) {
  return (
    <div className="flex w-full overflow-scroll border-b-2 text-white md:block md:h-screen md:border-r-2">
      {files.length === 0 ? (
        <div className="mt-2 px-2 text-center text-gray-400">
          You do not have any notes yet.
        </div>
      ) : null}

      {files.map((file, idx) => (
        <File
          forceRerender={forceRerender}
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
