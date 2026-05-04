import { Note } from "@/screens/Home";
import moment from "moment";
import { Dispatch, RefObject, SetStateAction, useRef } from "react";

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
  //This is just to prevent it scrolling into view when a user clicks on the file. Its a bit jaring.
  //willScroll is a ref because the if check executes every render.
  const fileRef = useRef<HTMLDivElement>(null);

  if (selectedFileIdx.current === idx) {
    fileRef.current?.scrollIntoView();
  }

  return (
    <div
      ref={fileRef}
      className={`h-8 max-w-35 cursor-pointer scroll-m-8 border-x-1 border-b-1 border-gray-500 ${
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
        className={`flex cursor-pointer items-center justify-between text-xs text-white`}
      >
        <div className="truncate">
          {file.content?.slice(0, 50) || (
            <span className="truncate text-gray-500">Empty Note</span>
          )}
        </div>

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
