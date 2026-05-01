import { Dispatch, RefObject, SetStateAction } from "react";
import File from "../components/File";
import { Note } from "@/screens/Home";

type FileExplorerProps = {
  selectedFileIdx: RefObject<number>;
  files: Note[];
  deleteFileIdx: number;
  forceRerender: Dispatch<SetStateAction<number>>;
};

export default function FileExplorer({
  forceRerender,
  selectedFileIdx,
  files,
  deleteFileIdx,
}: FileExplorerProps) {
  return (
    <div className="h-screen overflow-scroll border-b-2 text-white md:border-r-2">
      {files.length === 0 ? (
        <div className="mt-2 px-2 text-center text-gray-400">
          You do not have any notes yet.
        </div>
      ) : null}

      {files.map((file, idx) => (
        <File
          forceRerender={forceRerender}
          deleteFileIdx={deleteFileIdx}
          idx={idx}
          selectedFileIdx={selectedFileIdx}
          file={file}
        />
      ))}
    </div>
  );
}
