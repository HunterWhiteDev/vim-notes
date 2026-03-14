interface FileProps {
  openedFileIdx: number;
  idx: number;
  selectedFileIdx: number;
  file: string;
}

export default function File({
  openedFileIdx,
  idx,
  selectedFileIdx,
  file,
}: FileProps) {
  return (
    <div
      className={`cursor-pointer border-b-2 border-gray-500 p-1 text-sm text-white hover:bg-gray-700 ${openedFileIdx === idx ? "bg-gray-700" : null} ${
        selectedFileIdx === idx
          ? "border-b-4 border-t-4 !border-blue-500"
          : null
      } `}
    >
      {file.content}
    </div>
  );
}
