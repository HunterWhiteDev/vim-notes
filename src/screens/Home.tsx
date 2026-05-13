import { useEffect, useRef, useState, useCallback } from "react";
import Editor from "./Editor";
import api from "../axios";
import _debounce from "lodash/debounce";
import Sidebar from "./Sidebar";
import { settingsData } from "../components/Settings";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { notesTable } from "../../api/drizzle/schema/notes";
import { EditorView } from "codemirror";
import { DirectoryMap } from "@/lib/directoryMap";
export type Note = typeof notesTable.$inferSelect;
export type SettingsActions = "SHOW_VIM_SETTINGS";
export type FocusedElement = "FileExplorer" | "Editor";


function Home() {
  const editorRef = useRef<EditorView>(null);

  const directoryMap = useRef<DirectoryMap>(new DirectoryMap([]));
  const openedFile = useRef<Note>(null);


  const selectedFileIdx = useRef(0);
  const selectedSettingIdx = useRef(0);
  const confirmingDelete = useRef(false);



  const [, forceRerender] = useState(0);
  const showSettings = useRef(false);
  const showVimConfig = useRef(false);
  const vimConfig = useRef("");



  const focusedElement = useRef<FocusedElement>("FileExplorer");

  const creatingFileIdx = useRef(-1);
  const creatingFilePath = useRef("");

  const ignoreInput = useRef(true);

  const [fetching, setFetching] = useState(false);



  const handleKeyDown = async (e: KeyboardEvent) => {
    let reRender = false;
    const key = e.key;
    if (e.altKey === true && key === "Escape") {
      const el: HTMLElement = window.document.activeElement as HTMLElement;
      el.blur();
      e.preventDefault();
      focusedElement.current = "FileExplorer";
      forceRerender((num) => num + 1);
      return;
    }


    //This prevents the rest of the listener from firing when we are typing in the editor in isnert mode
    if (
      window.document.activeElement?.className.includes("cm-content")
    ) {
      focusedElement.current = "Editor";
      return;
    } else {
      focusedElement.current = "FileExplorer";
      reRender = true;
    }

    if (key === "Enter") {
      if (showSettings.current) {
        switch (settingsData[selectedSettingIdx.current].action) {
          case "SHOW_VIM_SETTINGS": {
            showVimConfig.current = true;
            reRender = true;
            //Do something to update vim settings

            break;
          }
        }
        return;
      } else if (creatingFileIdx.current > -1) {
        creatingFileIdx.current = -1;

        const directoryArr = creatingFilePath.current
          .split("/")
          .filter((str) => str !== "");
        const title = directoryArr.pop() || "";
        const directory = "/" + directoryArr.join("/");

        await directoryMap.current.createNote(directory, title);

        forceRerender((num) => num + 1);
        return;
      }


      //Handle opening/closing folders
      const selectedEl = directoryMap.current.getDisplayElementByIndex(selectedFileIdx.current);
      if (selectedEl.type === "folder") {
        if (directoryMap.current.openFolders.has(selectedEl.id)) directoryMap.current.closeFolder(selectedFileIdx.current)
        else
          directoryMap.current.openFolder(selectedFileIdx.current);
      } else {
        editorRef.current?.focus();

        const selectedNote = directoryMap.current.getNoteByDisplayIndex(selectedFileIdx.current);
        openedFile.current = selectedNote;

        focusedElement.current = "Editor";
      }
    }

    if (creatingFileIdx.current > -1) {
      return;
    }

    if (key === "j") {
      if (showSettings.current) {
        if (selectedSettingIdx.current === settingsData.length - 1) {
          selectedSettingIdx.current = 0;
        } else selectedSettingIdx.current++;
      } else {
        if (selectedFileIdx.current >= directoryMap.current.displayLayout.length - 1) {
          selectedFileIdx.current = 0;
        } else selectedFileIdx.current++;
      }

      reRender = true;
    }

    if (key === "k") {
      if (showSettings.current) {
        if (selectedSettingIdx.current === 0) {
          selectedSettingIdx.current = settingsData.length - 1;
        } else selectedSettingIdx.current--;
      } else {
        if (selectedFileIdx.current === 0) {
          selectedFileIdx.current = selectedFileIdx.current =
            directoryMap.current.displayLayout.length - 1;
        } else selectedFileIdx.current--;
      }

      reRender = true;
    }

    //Create New Note or Cancel Delete
    if (key === "n") {
      if (confirmingDelete.current) {
        //cancel delete
        confirmingDelete.current = false;
      } else {
        //If we dont do this unconvential boolean check, the keyboard event listener appends "n" char to the start of the creatingFilePath string
        ignoreInput.current = true;

        const selectedEl = directoryMap.current.getDisplayElementByIndex(selectedFileIdx.current)
        let creatingPath = "";
        if (selectedEl)
          creatingPath = selectedEl.directory

            .split("/")
            .filter((str) => str !== "")
            .join("/");

        creatingFilePath.current = creatingPath;
        creatingFileIdx.current = selectedFileIdx.current || 0;
      }
      reRender = true;
    }

    //Delete note
    if (key === "d") {
      confirmingDelete.current = true;
      reRender = true;
    }

    //Do logic to delete note
    if (key === "y") {
      reRender = true;
      if (confirmingDelete.current === false) return;

      const selectedFile = directoryMap.current.getDisplayElementByIndex(selectedFileIdx.current)

      if (selectedFile.type == "note") {
        await directoryMap.current.deleteNote(selectedFileIdx.current);
      } else if (selectedFile.type === "folder") {
        await directoryMap.current.deleteFolder(selectedFileIdx.current);
      } else {
        console.error("Error deleting directory");
      }


      if (selectedFileIdx.current > 0) selectedFileIdx.current = selectedFileIdx.current - 1

      confirmingDelete.current = false;
    }

    //Cancel logic to delete not

    if (key === "s") {
      showSettings.current = !showSettings.current;
      if (showVimConfig.current) showVimConfig.current = false;
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

  //Adds directories and folders to current display array given the selectedFileIdx


  useEffect(() => {
    const getData = async () => {
      setFetching(true);

      const response = await api({ url: "/notes", method: "get" });

      const notes: Note[] = response.data.notes;
      console.log({ notes });
      directoryMap.current = new DirectoryMap(notes);

      const vimConfigResponse = await api({
        url: "/config/vim",
        method: "get",
      });

      vimConfig.current = vimConfigResponse.data[0].content || "";

      forceRerender((n) => n + 1);
      setFetching(false);
    };

    getData();
  }, []);

  const handleFileDataChange = async (e: string) => {
    if (!openedFile.current) return;
    try {
      const response = await api({
        method: "put",
        url: `/note/${openedFile.current.id}`,
        data: { fileData: e },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || error.message);
      }
    }

    const selectedNote = directoryMap.current.getNoteByDisplayIndex(selectedFileIdx.current) as Note;
    selectedNote.content = e;

    // filesData.current[selectedFileIdx.current].content = e;
    // filesData.current[selectedFileIdx.current].updated_at = new Date();
  };

  const debounceDataFn = useCallback(_debounce(handleFileDataChange, 500), [
    openedFile.current,
  ]);

  const handleVimConfigChange = async (input: string) => {
    try {
      const response = await api({
        method: "put",
        url: `/config/vim`,
        data: { fileData: input },
      });

      vimConfig.current = input;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || error.message);
      }
    }
  };

  const debounceVimFn = useCallback(_debounce(handleVimConfigChange, 500), []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div
        className={`w-50 border-2 border-transparent ${focusedElement.current === "FileExplorer" ? "border-blue-500!" : null}`}
      >
        <Sidebar
          showSettings={showSettings.current}
          selectedFileIdx={selectedFileIdx}
          selectedSettingIdx={selectedSettingIdx.current}
          files={directoryMap.current.displayLayout}
          openFolders={directoryMap.current.openFolders}
          creatingFileIdx={creatingFileIdx}
          creatingFilePath={creatingFilePath}
          forceRerender={forceRerender}
          ignoreInput={ignoreInput}
          confirmingDelete={confirmingDelete}
        />
      </div>
      <div className="w-full">
        {fetching ? (
          <div>
            <Loader className="animate-spin" />
          </div>
        ) : showVimConfig.current ? (
          <div
            className={`border-2 border-transparent ${focusedElement.current === "Editor" ? "border-blue-500!" : null}`}
          >
            <Editor
              editorRef={editorRef}
              fileData={vimConfig.current}
              handleFileDataChange={debounceVimFn}
              vimConfig={vimConfig}
            />
          </div>
        ) : openedFile.current ? (
          <div
            className={`border-2 border-transparent ${focusedElement.current === "Editor" ? "border-blue-500!" : null}`}
          >
            <Editor
              openedFile={openedFile.current}
              editorRef={editorRef}
              fileData={openedFile.current?.content || ""}
              selectedFileIdx={selectedFileIdx}
              handleFileDataChange={debounceDataFn}
              vimConfig={vimConfig}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-lg text-gray-300">
              Open a note to get started
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
