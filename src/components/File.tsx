import { Note } from "@/screens/Home";
import moment from "moment";
import { Dispatch, RefObject, SetStateAction } from "react";

interface FileProps {
  idx: number;
  selectedFileIdx: RefObject<number>;
  file: Note;
  deleteFileIdx: number;
  forceRerender: Dispatch<SetStateAction<number>>;
}

export default function File({
  forceRerender,
  idx,
  selectedFileIdx,
  file,
  deleteFileIdx,
}: FileProps) {
  return (
    <div
      className={`min-w-30 cursor-pointer border-x-1 border-gray-500 p-1 md:min-w-50 md:border-x-0 md:border-y-1 ${
        selectedFileIdx.current === idx
          ? "border-blue-500! bg-gray-700 md:border-y-0"
          : null
      } hover:bg-gray-700`}
      onClick={() => {
        selectedFileIdx.current = idx;
        forceRerender((idx) => idx + 1);
      }}
    >
      <div
        className={`flex cursor-pointer items-center justify-between text-sm text-white`}
      >
        {file.content?.slice(0, 20) || (
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
