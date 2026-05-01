import { useEffect, useRef, useState, useCallback, EventHandler } from "react";
import Editor from "./Editor";
import api from "../axios";
import _debounce from "lodash/debounce";
import Sidebar from "./Sidebar";
import { commandData } from "../components/CommandPallete";
import { useSession } from "@/lib/authClient";
import { AxiosError } from "axios";
import useToast from "@/hooks/useToast";
import { Loader } from "lucide-react";
import { notesTable } from "../../api/drizzle/schema/notes";
import { EditorView } from "codemirror";
export type Note = typeof notesTable.$inferSelect;

function Home() {
  const editorRef = useRef<EditorView>(null);

  const selectedFileIdx = useRef(0);
  const selectedCommandIdx = useRef(0);
  const [, forceRerender] = useState(0);
  const filesData = useRef<Note[]>([]);
  const showPallete = useRef(false);
  const deleteFileIdx = useRef(-1);

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
    if (window.document.activeElement?.className.includes("cm-content")) {
      return;
    }

    let reRender = false;

    if (key === "j") {
      if (showPallete.current) {
        if (selectedCommandIdx.current === commandData.length - 1) {
          selectedCommandIdx.current = 0;
        } else selectedCommandIdx.current++;

        return;
      }

      if (filesData.current === null) return;

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
      if (showPallete.current) {
        commandData[selectedCommandIdx.current].action();
        return;
      }
      if (!editorRef.current) return;
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
      setFetching(true);
      const response = await api({ url: "/notes", method: "get" });
      filesData.current = response.data.notes;
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

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-35">
        <Sidebar
          forceRerender={forceRerender}
          showPallete={showPallete.current}
          selectedFileIdx={selectedFileIdx}
          files={filesData.current}
          selectedCommandIdx={selectedCommandIdx.current}
          deleteFileIdx={deleteFileIdx.current}
        />
      </div>
      <div className="w-full">
        {fetching ? (
          <div>
            <Loader className="animate-spin" />
          </div>
        ) : (
          <Editor
            editorRef={editorRef}
            fileData={filesData.current[selectedFileIdx.current]?.content || ""}
            selectedFileIdx={selectedFileIdx}
            handleFileDataChange={debounceDataFn}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
