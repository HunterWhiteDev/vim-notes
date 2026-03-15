import { useEffect, useRef, useState, useCallback } from "react";
import Editor from "./screens/Editor";
import api from "./axios";
import _debounce from "lodash/debounce";
import Sidebar from "./screens/Sidebar";
import { commandData } from "./components/CommandPallete";
function App() {
  const editorRef = useRef(null);

  const [openedFileIdx, setOpenedFileIdx] = useState(0);
  const selectedFileIdx = useRef(0);
  const selectedCommandIdx = useRef(0);
  const [, forceRerender] = useState(0);
  const filesData = useRef([]);
  const mode = useRef(null);
  const showPallete = useRef(false);
  const deleteFileIdx = useRef(-1);
  const confirmingDelete = useRef(false);

  const handleKeyDown = async (e) => {
    const key = e.key;
    console.log({ e });

    let reRender = false;

    if (key === "j") {
      if (showPallete.current) {
        if (selectedCommandIdx.current === commandData.length - 1) {
          selectedCommandIdx.current = 0;
        } else selectedCommandIdx.current++;

        return;
      }

      if (selectedFileIdx.current === filesData.current.length - 1) {
        selectedFileIdx.current = 0;
      } else selectedFileIdx.current++;
      reRender = true;
    }

    if (key === "k") {
      if (showPallete.current) {
        if (selectedCommandIdx.current === 0) {
          selectedCommandIdx.current = commandData.length - 1;
        } else selectedCommandIdx.current--;

        return;
      }

      if (selectedFileIdx.current === 0) {
        selectedFileIdx.current = filesData.current.length - 1;
      } else selectedFileIdx.current--;

      reRender = true;
    }

    console.log({ e });
    if (e.altKey === true && key === "Escape") {
      window.document.activeElement?.blur();
      e.preventDefault();
    }

    //Create New Note
    if (key === "n") {
      const response = await api({ url: "/note", method: "post" });
      if (response.status === 200) {
        filesData.current = [response.data.note[0], ...filesData.current];
      }
      selectedFileIdx.current = 0;
      editorRef.current.focus();
      reRender = true;
    }

    //Delete note
    if (key === "d") {
      e.preventDefault();
      deleteFileIdx.current = selectedFileIdx.current;
      reRender = true;
      console.log("pressing delete");
    }

    //Do logic to delete note
    if (key === "y") {
      if (deleteFileIdx.current === -1) return;

      const response = await api({
        url: `/note/${filesData.current[deleteFileIdx.current].id}`,
        method: "delete",
      });
      if (response.status === 200) {
        filesData.current = filesData.current.filter((note) => {
          if (note.id === filesData.current[deleteFileIdx.current].id)
            return false;
          return true;
        });
        reRender = true;
        deleteFileIdx.current = -1;
      }
    }

    //Cancel logic to delete not

    if (key === "Enter") {
      if (showPallete.current) {
        commandData[selectedCommandIdx.current].action();
        return;
      }
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
      console.log({ response: response.data.notes });
      filesData.current = response.data.notes;
      forceRerender((n) => n + 1);
    };

    getData();
  }, []);

  const handleFileDataChange = async (e: string) => {
    //TODO: Setup debounce in this function
    console.log(e, { filesData }, { selectedFileIdx: selectedFileIdx.current });
    const response = await api({
      method: "put",
      url: `/note/${filesData.current[selectedFileIdx.current].id}`,
      data: { fileData: e },
    });

    console.log(response);
  };

  const debounceDataFn = useCallback(_debounce(handleFileDataChange, 500), [
    filesData.current,
  ]);

  console.log({
    selectedFileIdx: selectedFileIdx.current,
    filesData: filesData.current,
  });

  return (
    <div className="flex h-[100vh] bg-gray-900 text-white">
      <div className="w-[200px]">
        <Sidebar
          showPallete={showPallete.current}
          openedFileIdx={openedFileIdx}
          selectedFileIdx={selectedFileIdx.current}
          files={filesData.current}
          selectedCommandIdx={selectedCommandIdx.current}
          deleteFileIdx={deleteFileIdx.current}
        />
      </div>
      <div className="w-full">
        <Editor
          mode={mode}
          editorRef={editorRef}
          fileData={filesData.current[selectedFileIdx.current]?.content}
          handleFileDataChange={debounceDataFn}
        />
      </div>
    </div>
  );
}

export default App;
