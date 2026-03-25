import moment from "moment";

interface FileProps {
  openedFileIdx: number;
  idx: number;
  selectedFileIdx: number;
  file: {
    id: number;
    content: string;
    updated_at: string;
  };
  deleteFileIdx: number;
}

export default function File({
  idx,
  selectedFileIdx,
  file,
  deleteFileIdx,
}: FileProps) {
  return (
    <div
      className={`min-w-30 border-x-1 border-gray-500 p-1 md:min-w-50 md:border-x-0 md:border-y-1 ${
        selectedFileIdx === idx
          ? "border-blue-500! bg-gray-700 md:border-y-0"
          : null
      } hover:bg-gray-700`}
    >
      <div
        className={`flex cursor-pointer items-center justify-between text-sm text-white`}
      >
        {file.content.slice(0, 10) || (
          <span className="text-gray-500">Empty Note</span>
        )}

        {deleteFileIdx === idx ? (
          <div className="flex-col items-center justify-center text-center text-xs">
            <div>delete?</div>
            <div>y/n</div>
          </div>
        ) : null}
      </div>
      <div className="flex items-center text-[10px] text-gray-400">
        {moment(file.updated_at).fromNow()}
      </div>
    </div>
  );
}
