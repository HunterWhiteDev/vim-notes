import { useEffect, useRef, useState, useCallback } from "react";
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
export type Note = typeof notesTable.$inferSelect;
export type SettingsActions = "SHOW_VIM_SETTINGS";

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
        if (filesData.current === null) return;

        if (selectedFileIdx.current === filesData.current.length - 1) {
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
          selectedFileIdx.current = filesData.current.length - 1;
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
      }
      if (!editorRef.current) return;
      editorRef.current.focus();
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

  useEffect(() => {
    const getData = async () => {
      setFetching(true);
      const response = await api({ url: "/notes", method: "get" });
      filesData.current = response.data.notes;

      const vimConfigResponse = await api({
        url: "/config/vim",
        method: "get",
      });

      vimConfig.current = vimConfigResponse.data[0].content || "";

      forceRerender((n) => n + 1);
      setFetching(false);
    };

    getData();
  }, [session]);

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
      <div className="w-35">
        <Sidebar
          forceRerender={forceRerender}
          showSettings={showSettings.current}
          selectedFileIdx={selectedFileIdx}
          files={filesData.current}
          selectedSettingIdx={selectedSettingIdx.current}
          deleteFileIdx={deleteFileIdx.current}
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
            fileData={filesData.current[selectedFileIdx.current]?.content || ""}
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
