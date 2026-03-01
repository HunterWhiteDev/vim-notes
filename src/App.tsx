import { useEffect, useRef, useState } from "react";
import Editor from "./screens/Editor";
import FileExplorer from "./screens/FileExplorer";
import api from "./axios";

function App() {
  const editorRef = useRef(null);

  const [openedFileIdx, setOpenedFileIdx] = useState(0);
  const selectedFileIdx = useRef(0);
  const [, forceRerender] = useState(0);
  const [fileNames, setFileNames] = useState([]);
  const [filesData, setFilesData] = useState([""]);

  // const focusEditor = () => {
  //   editorRef.current.focus();
  // };

  const handleKeyDown = (e) => {
    console.log({ e });
    const key = e.key;

    let reRender = false;

    if (key === "j") {
      // setSelectedFileIdx((selectedFileIdx) => selectedFileIdx + 1);
      selectedFileIdx.current++;
      reRender = true;
    }

    if (key === "k") {
      // setSelectedFileIdx((selectedFileIdx) => selectedFileIdx - 1);
      selectedFileIdx.current--;
      reRender = true;
    }

    console.log({ e });
    if (e.ctrlKey && key === "o") {
      e.preventDefault();
      setIsSelecting(true);
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
          handleFileDataChange={handleFileDataChange}
        />
      </div>
    </div>
  );
}

export default App;
