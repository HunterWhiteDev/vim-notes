import { RefObject } from "react";
import { DisplayElement } from "@/screens/Home";
import { Folder, File } from "lucide-react";

type FileExplorerProps = {
  selectedFileIdx: RefObject<number>;
  files: RefObject<DisplayElement[]>;
};

export default function FileExplorer({
  files,
  selectedFileIdx,
}: FileExplorerProps) {
  return (
    <div className="h-screen overflow-hidden overflow-scroll border-r border-b-2 px-1 py-1 whitespace-nowrap text-white">
      {files.current.map((el, idx) => (
        <div
          style={{ marginLeft: `${el.offset !== 0 ? el.offset / 2 : 0}em` }}
          className={`rounded-xs px-1 ${selectedFileIdx.current === idx ? "bg-gray-500/50" : null}`}
        >
          {el.type === "folder" ? (
            <div className="flex items-center gap-1">
              <div>
                <Folder width={15} height={15} />
              </div>
              <div>{el.title}</div>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div>
                <File width={15} height={15} />
              </div>
              <div>{el.title}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
