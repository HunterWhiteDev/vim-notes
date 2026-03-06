import { useEffect, useRef, useState, useCallback } from "react";
import Editor from "./screens/Editor";
import FileExplorer from "./screens/FileExplorer";
import api from "./axios";
import _debounce from "lodash/debounce";

function App() {
  const editorRef = useRef(null);

  const [openedFileIdx, setOpenedFileIdx] = useState(0);
  const selectedFileIdx = useRef(0);
  const [, forceRerender] = useState(0);
  const [fileNames, setFileNames] = useState([]);
  const [filesData, setFilesData] = useState([""]);
  const filesCount = useRef(0);

  const handleKeyDown = (e) => {
    console.log({ e });
    const key = e.key;

    let reRender = false;

    if (key === "j") {
      // setSelectedFileIdx((selectedFileIdx) => selectedFileIdx + 1);

      if (selectedFileIdx.current === filesCount.current - 1) {
        selectedFileIdx.current = 0;
      } else selectedFileIdx.current++;
      reRender = true;
    }

    if (key === "k") {
      console.log({ selectedFileIdx: selectedFileIdx.current });
      // setSelectedFileIdx((selectedFileIdx) => selectedFileIdx - 1);
      if (selectedFileIdx.current === 0) {
        console.log("condition met");
        selectedFileIdx.current = filesCount.current - 1;
      } else selectedFileIdx.current--;

      reRender = true;
    }

    console.log({ e });
    if (e.ctrlKey && key === "o") {
      e.preventDefault();
    }

    if (key === "Enter") {
      setOpenedFileIdx(selectedFileIdx.current);
      editorRef.current.focus();
      reRender = true;
    }

    if (reRender) {
      forceRerender((n) => n + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await api({ url: "/notes", method: "get" });
      console.log({ response });
      setFileNames(response.data.fileNames);
      setFilesData(response.data.filesData);
      filesCount.current = response.data.fileNames.length;
    };

    getData();
  }, []);

  const handleFileDataChange = async (e: string) => {
    //TODO: Setup debounce in this function
    console.log(e);
    const fileName = fileNames[selectedFileIdx.current];
    const response = await api({
      method: "post",
      url: `/note/${fileName}`,
      data: { fileData: e },
    });

    console.log(response);
  };

  const debounceDataFn = useCallback(_debounce(handleFileDataChange, 500), [
    fileNames,
  ]);

  return (
    <div className="flex h-[100vh] bg-gray-900">
      <div className="w-[200px]">
        <FileExplorer
          openedFileIdx={openedFileIdx}
          selectedFileIdx={selectedFileIdx.current}
          files={fileNames}
        />
      </div>
      <div className="w-full">
        <Editor
          editorRef={editorRef}
          fileData={filesData[selectedFileIdx.current]}
          handleFileDataChange={debounceDataFn}
        />
      </div>
    </div>
  );
}

export default App;
