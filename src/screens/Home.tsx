import { useEffect, useRef, useState, useCallback, RefObject } from "react";
import Editor from "./Editor";
import api from "../axios";
import _debounce from "lodash/debounce";
import Sidebar from "./Sidebar";
import { settingsData } from "../components/Settings";
import { useSession } from "@/lib/authClient";
import { AxiosError } from "axios";
import useToast from "@/hooks/useToast";
import { Loader } from "lucide-react";
import { notesTable } from "../../api/drizzle/schema/notes";
import { EditorView } from "codemirror";
import { UUID } from "crypto";
export type Note = typeof notesTable.$inferSelect;
export type SettingsActions = "SHOW_VIM_SETTINGS";

export type DisplayElement = {
  directory: string;
  type: "folder" | "note";
  offset: number;
  title: string;
  content?: string;
  id: number;
};

function Home() {
  const editorRef = useRef<EditorView>(null);

  const selectedFileIdx = useRef(0);
  const selectedSettingIdx = useRef(0);
  const [, forceRerender] = useState(0);
  const filesData = useRef<Note[]>([]);
  const showSettings = useRef(false);
  const deleteFileIdx = useRef(-1);
  const showVimConfig = useRef(false);
  const vimConfig = useRef("");

  const displayArr = useRef<DisplayElement[]>([]);
  const directoryMap = useRef({ __notes: [] });

  const openFolders = useRef(new Set<number>());

  const selectedFile = useRef(null);

  const folders = useRef([]);
  const files = useRef([]);

  const currentPath = useRef("/");
  const previousPath = useRef(null);

  const [fetching, setFetching] = useState(false);

  const session = useSession();

  const toast = useToast();

  const handleKeyDown = async (e: KeyboardEvent) => {
    const key = e.key;
    if (e.altKey === true && key === "Escape") {
      if (!window.document.activeElement) return;
      const el: HTMLElement = window.document.activeElement as HTMLElement;
      el.blur();
      e.preventDefault();
    }

    //This prevents the rest of the listener from firing when we are typing in the editor in isnert mode
    if (
      window.document.activeElement?.className.includes("cm-content") ||
      window.document.activeElement?.tagName === "INPUT"
    ) {
      return;
    }

    let reRender = false;

    if (key === "j") {
      if (showSettings.current) {
        if (selectedSettingIdx.current === settingsData.length - 1) {
          selectedSettingIdx.current = 0;
        } else selectedSettingIdx.current++;
      } else {
        if (selectedFileIdx.current >= displayArr.current.length - 1) {
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
            displayArr.current.length - 1;
        } else selectedFileIdx.current--;
      }

      reRender = true;
    }

    //Create New Note or Cancel Delete
    if (key === "n") {
      if (deleteFileIdx.current !== -1) {
        deleteFileIdx.current = -1;
      } else {
        const response = await api({ url: "/note", method: "post" });
        if (response.status === 200) {
          filesData.current = [response.data.note[0], ...filesData.current];
        }
        selectedFileIdx.current = 0;
        if (!editorRef.current) return;
        editorRef.current.focus();
      }
      reRender = true;
    }

    //Delete note
    if (key === "d") {
      deleteFileIdx.current = selectedFileIdx.current;
      reRender = true;
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

        //If we delete the last file set the selected file to previous file in the array
        if (
          deleteFileIdx.current + 1 === filesData.current.length &&
          filesData.current.length > 2
        ) {
          selectedFileIdx.current = deleteFileIdx.current - 1;
        }

        // //Do the inverse if we delete the first file
        // if (deleteFileIdx.current === 0) {
        //   selectedFileIdx.current = ;
        // }

        deleteFileIdx.current = -1;
      }
    }

    //Cancel logic to delete not

    if (key === "Enter") {
      if (showSettings.current) {
        switch (settingsData[selectedSettingIdx.current].action) {
          case "SHOW_VIM_SETTINGS": {
            console.log("something");
            showVimConfig.current = true;
            reRender = true;
            //Do something to update vim settings

            break;
          }
        }
        return;
      }
      if (!editorRef.current) return;

      const selectedEl = displayArr.current[selectedFileIdx.current];
      if (selectedEl.type === "folder") {
        if (!openFolders.current.has(selectedEl.id))
          openFolder(selectedFileIdx.current);
        else closeFolder(selectedFileIdx.current);
      }

      //
      // editorRef.current.focus();
      reRender = true;
    }

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
  const openFolder = (selectedFileIdx: number) => {
    let selectedEl = displayArr.current[selectedFileIdx];
    if (!selectedEl)
      selectedEl = {
        id: Math.floor(Math.random() * 10),
        type: "folder",
        directory: "/",
        offset: -1,
        title: "",
        content: "",
      };

    if (selectedEl?.type !== "folder")
      throw new Error("You have called openFolder() on a file");

    const directoryKeys = selectedEl.directory
      .split("/")
      .filter((key) => key !== "");

    if (selectedEl.title !== "") directoryKeys.push(selectedEl.title);

    let currentObj = directoryMap.current;

    //If length ===  the we are in the "/" dir and can skip finding the right path, we already know its the base directory
    if (directoryKeys.length > 0) {
      for (const key of directoryKeys) {
        console.log({ key });
        currentObj = currentObj[key];
      }
    }

    //We are building the sub array that will be inserted into displayArr
    let newDisplayElements: DisplayElement[] = [];

    const folders = Object.keys(currentObj).filter((key) => key !== "__notes");

    const notes = currentObj.__notes;

    const dir = selectedEl.directory + "/" + selectedEl.title;

    //Offset is selectedEl.offset + 1 || 0 because if selectedEl is null we are in root path
    folders.forEach((folder) => {
      let numberString = "";
      for (let i = 0; i < 10; i++) {
        numberString += Math.floor(Math.random() * 10).toString();
      }

      console.log({ numberString });
      newDisplayElements.push({
        offset: selectedEl.offset + 1 || 0,
        title: folder,
        type: "folder",
        directory: dir,
        id: parseInt(numberString),
      });
    });

    notes.forEach((note: Note) =>
      newDisplayElements.push({
        offset: selectedEl.offset + 1 || 0,
        title: note.title,
        type: "note",
        content: note.content || "",
        directory: dir,
        id: note.id,
      }),
    );

    //Since we are inserting the new elements somewhere in the middle of the array, we calculate the first half, the ending half, when insert in between
    const start = displayArr.current.slice(0, selectedFileIdx + 1);
    const end = displayArr.current.slice(
      selectedFileIdx + 1,
      displayArr.current.length,
    );

    const newArr = [...start, ...newDisplayElements, ...end];
    console.log({ newArr });
    displayArr.current = newArr;

    openFolders.current.add(selectedEl.id);
  };

  const closeFolder = (selectedFileIdx: number) => {
    const selectedEl = displayArr.current[selectedFileIdx];

    let start = displayArr.current.slice(0, selectedFileIdx + 1);
    let end = displayArr.current
      .slice(selectedFileIdx + 1, displayArr.current.length)
      .filter((file) => {
        if (file.offset <= selectedEl.offset) return true;
        else return false;
      });

    openFolders.current.delete(selectedEl.id);
    displayArr.current = [...start, ...end];
  };

  useEffect(() => {
    const getData = async () => {
      setFetching(true);

      displayArr.current = [];
      openFolders.current = new Set();
      directoryMap.current = { __notes: [] };
      const response = await api({ url: "/notes", method: "get" });

      const notesResponse: Note[] = response.data.notes;

      for (const file of notesResponse) {
        const dirArr = file.directory.split("/");

        let counter = 0;
        let currentDir = directoryMap.current;

        if (file.directory === "/") currentDir.__notes.push(file);

        for (const dir of dirArr) {
          if (dir === "") {
            counter++;
            continue;
          }
          if (!currentDir[dir]) currentDir[dir] = { __notes: [] };

          currentDir = currentDir[dir];
          console.log(dir, counter, dirArr.length - 1);
          if (counter === dirArr.length - 1) currentDir.__notes.push(file);

          counter++;
        }
      }

      openFolder(0);

      //This is the json containing the structure in how the fiel explorer will be displayed
      // const displayArr: DisplayElement[] = [];

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
    try {
      const response = await api({
        method: "put",
        url: `/note/${filesData.current[selectedFileIdx.current].id}`,
        data: { fileData: e },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || error.message);
      }
    }

    filesData.current[selectedFileIdx.current].content = e;
    filesData.current[selectedFileIdx.current].updated_at = new Date();
  };

  const debounceDataFn = useCallback(_debounce(handleFileDataChange, 500), [
    filesData.current,
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
      <div className="w-50">
        <Sidebar
          forceRerender={forceRerender}
          showSettings={showSettings.current}
          selectedFileIdx={selectedFileIdx}
          selectedSettingIdx={selectedSettingIdx.current}
          deleteFileIdx={deleteFileIdx.current}
          files={displayArr}
        />
      </div>
      <div className="w-full">
        {fetching ? (
          <div>
            <Loader className="animate-spin" />
          </div>
        ) : showVimConfig.current ? (
          <Editor
            editorRef={editorRef}
            fileData={vimConfig.current}
            handleFileDataChange={debounceVimFn}
            vimConfig={vimConfig}
          />
        ) : (
          <Editor
            editorRef={editorRef}
            fileData={selectedFile?.current?.content}
            selectedFileIdx={selectedFileIdx}
            handleFileDataChange={debounceDataFn}
            vimConfig={vimConfig}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
