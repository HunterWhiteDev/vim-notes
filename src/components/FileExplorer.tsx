import { Dispatch, RefObject, SetStateAction } from "react";
import { DisplayElement } from "@/screens/Home";
import { Folder, File, FolderOpen } from "lucide-react";

type FileExplorerProps = {
  selectedFileIdx: RefObject<number>;
  files: DisplayElement[];
  openFolders: Set<number>;
  creatingFileIdx: RefObject<number>;
  creatingFilePath: RefObject<string>;
  forceRerender: Dispatch<SetStateAction<number>>;
  ignoreInput: RefObject<boolean>;
  confirmingDelete: RefObject<boolean>;
};

export default function FileExplorer({
  files,
  selectedFileIdx,
  openFolders,
  creatingFileIdx,
  creatingFilePath,
  forceRerender,
  ignoreInput,
  confirmingDelete
}: FileExplorerProps) {
  const handleInputChange = (val: string) => {
    if (ignoreInput.current === true) {
      ignoreInput.current = false;
    } else {
      creatingFilePath.current = val;
    }

    forceRerender((num) => num + 1);
  };

  return (
    <div className="h-screen overflow-hidden px-1 py-1 whitespace-nowrap text-white">
      {creatingFileIdx.current === 0 && files?.length === 0 ? (
        <div className="absolute z-10 w-40 rounded-sm border bg-gray-900 outline-none">
          <div>Enter File Path</div>
          <div>
            /
            <input
              value={creatingFilePath.current}
              onChange={(e) => handleInputChange(e.target.value)}
              className="whitespace-normal outline-none"
              autoFocus
            />
          </div>
        </div>
      ) : null}

      {files.map((el, idx) => (
        <div
          style={{ marginLeft: `${el.offset !== 0 ? el.offset / 4 : 0}em` }}
          className={`relative rounded-xs px-1 ${selectedFileIdx.current === idx ? "bg-gray-500/50" : null}`}
        >
          {idx === selectedFileIdx.current && confirmingDelete.current === true ? (
            <div className="absolute z-10 rounded-sm border bg-gray-900 p-1 text-xs whitespace-normal">
              Delete{" "}
              {
                el.directory !== "/" ? el.directory : "" +
                  "/" +
                  el.title}
              ?
              <br />
              y/n
            </div>
          ) : null}

          {creatingFileIdx.current === idx ? (
            <div className="absolute z-10 w-40 rounded-sm border bg-gray-900 outline-none">
              <div>Enter File Path</div>
              <div>
                /
                <input
                  value={creatingFilePath.current}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="whitespace-normal outline-none"
                  autoFocus
                />
              </div>
            </div>
          ) : null}

          {el.type === "folder" ? (
            <div className="flex items-center gap-1">
              <div>
                {openFolders.has(el.id) ? (
                  <FolderOpen width={15} height={15} />
                ) : (
                  <Folder width={15} height={15} />
                )}
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
