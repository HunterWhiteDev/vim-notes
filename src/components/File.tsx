interface FileProps {
  openedFileIdx: number;
  idx: number;
  selectedFileIdx: number;
  file: {
    id: number;
    content: string;
  };
  deleteFileIdx: number;
}

export default function File({
  openedFileIdx,
  idx,
  selectedFileIdx,
  file,
  deleteFileIdx,
}: FileProps) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between border-b-2 border-gray-500 p-1 text-sm text-white hover:bg-gray-700 ${openedFileIdx === idx ? "bg-gray-700" : null} ${
        selectedFileIdx === idx
          ? "border-b-4 border-t-4 !border-blue-500"
          : null
      } `}
    >
      {file.content.slice(0, 20) || (
        <span className="text-gray-500">Empty Note</span>
      )}

      {deleteFileIdx === idx ? (
        <div className="flex-col items-center justify-center text-center text-xs">
          <div>delete?</div>
          <div>y/n</div>
        </div>
      ) : null}
    </div>
  );
}
