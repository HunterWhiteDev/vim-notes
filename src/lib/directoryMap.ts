import api from "@/axios";
import { Note } from "@/screens/Home";
import { AxiosError } from "axios";
import toast from "react-hot-toast";


interface DirectoryMapObject {
  [key: string]: DirectoryMapObject | Note[];
  __notes: Note[];

}


export type DisplayElement = {
  directory: string;
  type: "folder" | "note";
  offset: number;
  title: string;
  id: number;
};


export class DirectoryMap {

  //Mimicking file structure
  //The notes here are the source of truth for any note data that needs to be updated that is not the title or directory path. Changing any note should use the method getNote() to get the note from here, and redraw() to recalculate the date in the displayLayout array.
  private directoryMapObject: DirectoryMapObject = { __notes: [] };

  //Visual array to use in jsx rendering
  public displayLayout: DisplayElement[] = [];

  public openFolders: Set<number> = new Set();
  private files: Note[] = [];

  constructor(files: Note[]) {


    this.buildNotesObjects(files)

  }


  buildNotesObjects(files: Note[]) {
    this.files = files;


    for (const file of files) {
      const dirArr = file.directory.split("/");

      let counter = 0;
      let currentDir: DirectoryMapObject = this.directoryMapObject;

      if (file.directory === "/") currentDir.__notes.push(file);

      for (const dir of dirArr) {
        if (dir === "") {
          counter++;
          continue;
        }
        if (!currentDir[dir]) currentDir[dir] = { __notes: [] };

        currentDir = currentDir[dir] as DirectoryMapObject;
        if (counter === dirArr.length - 1) currentDir.__notes.push(file);

        counter++;
      }
    }



    this.openFolder(0);
  }

  openFolder(selectedFileIdx: number) {
    let selectedEl: DisplayElement = this.displayLayout[selectedFileIdx];
    if (!selectedEl)
      selectedEl = {
        id: Math.floor(Math.random() * 10),
        type: "folder",
        directory: "/",
        offset: -1,
        title: "",
      };

    if (selectedEl?.type !== "folder")
      throw new Error("You have called openFolder() on a file");

    const directoryKeys = selectedEl.directory
      .split("/")
      .filter((key) => key !== "");

    if (selectedEl.title !== "") directoryKeys.push(selectedEl.title);

    let currentObj = this.directoryMapObject;

    //If length ===  the we are in the "/" dir and can skip finding the right path, we already know its the base directory
    if (directoryKeys.length > 0) {
      for (const key of directoryKeys) {
        currentObj = currentObj[key] as DirectoryMapObject;
      }
    }

    //We are building the sub array that will be inserted into displayArr
    let newDisplayElements: DisplayElement[] = [];

    const folders = Object.keys(currentObj).filter((key) => key !== "__notes");

    const notes = currentObj.__notes;


    let dirFirstHalf = "";
    if (selectedEl.directory === "/") dirFirstHalf = '/';
    else dirFirstHalf = selectedEl.directory + "/";

    let dir = dirFirstHalf + selectedEl.title;
    if (dir[0] === "/" && dir[1] === "/") {

      dir = dir.slice(1, dir.length)
    };


    //Offset is selectedEl.offset + 1 || 0 because if selectedEl is null we are in root path
    folders.forEach((folder) => {
      let numberString = "";
      for (let i = 0; i < 10; i++) {
        numberString += Math.floor(Math.random() * 10).toString();
      }

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
        directory: dir,
        id: note.id,
      }),
    );

    //Since we are inserting the new elements somewhere in the middle of the array, we calculate the first half, the ending half, when insert in between
    const start = this.displayLayout.slice(0, selectedFileIdx + 1);
    const end = this.displayLayout.slice(
      selectedFileIdx + 1,
      this.displayLayout.length,
    );

    const newArr = [...start, ...newDisplayElements, ...end];
    this.displayLayout = newArr;

    this.openFolders.add(selectedEl.id);
  };


  closeFolder(selectedFileIdx: number) {
    const selectedEl = this.displayLayout[selectedFileIdx];

    let start = this.displayLayout.slice(0, selectedFileIdx + 1);
    let end = this.displayLayout
      .slice(selectedFileIdx + 1, this.displayLayout.length)
      .filter((file) => {
        if (file.offset <= selectedEl.offset) return true;
        else return false;
      });

    this.openFolders.delete(selectedEl.id);
    this.displayLayout = [...start, ...end];
  };


  //Never expose this as public. This should only be used in other class methods
  private getSelectedNote(selectedFileIdx: number): Note {

    //Get the current directory from selected note in the displayLayout.
    const selectedDisplayEl = this.displayLayout[selectedFileIdx];
    const directoryArr = selectedDisplayEl.directory
      .split("/")
      .filter((key) => key !== "");


    //Then here, we set the current object to the nested dir path the note lives at
    let currentObj = this.directoryMapObject;
    for (const key of directoryArr) {
      currentObj = currentObj[key] as DirectoryMapObject;
    }

    //Once we are at the nested dir we we can filter the notes object for the note with that id and return it. This will be a reference to that note

    const selectedNote = currentObj.__notes.filter(
      (note) => note.id === selectedDisplayEl.id,
    )[0];
    return selectedNote;

  }

  updateNoteContent(selectedNoteIdx: number, content: string) {
    const note = this.getSelectedNote(selectedNoteIdx);
    note.content = content;
    this.redraw();

  }


  private redraw() {
    for (const el of this.displayLayout) {
      const dirArr = el.directory.split("/").filter(str => str !== "");

      let currentDirObj = this.directoryMapObject;
      for (const dir of dirArr) {
        currentDirObj = currentDirObj[dir] as DirectoryMapObject;
      }

    }

  }



  getDisplayElementByIndex(idx: number): DisplayElement {
    return this.displayLayout[idx];
  }


  getNoteByDisplayIndex(idx: number): Note | undefined {
    const selectedNote = this.displayLayout[idx];
    const dirArr = selectedNote.directory.split("/").filter(str => str !== "");

    let currentDirObj = this.directoryMapObject;
    for (const dir of dirArr) {
      currentDirObj = currentDirObj[dir] as DirectoryMapObject;
    }

    for (const noteEl of currentDirObj.__notes) {
      if (noteEl.id === selectedNote.id) return noteEl;
    }


  }


  //TODO: Make it so empty folders get removed even if they're nested
  async deleteFolder(selectedFileIdx: number) {
    //TODO: If currently opened note is within the folder, set it to null
    const selectedFolder = this.getDisplayElementByIndex(selectedFileIdx) as DisplayElement;

    try {
      const response = await api({
        url: `/directory`,
        method: "delete",
        data: {
          directory: selectedFolder.directory,
        }
      });
      if (response.status === 200) {
        //Filter all sub directories
        this.displayLayout = this.displayLayout.filter((el: DisplayElement) => !el.directory.startsWith(selectedFolder.directory + "/" + selectedFolder.title))

        //Filter out folder itself
        this.displayLayout = this.displayLayout.filter((el: DisplayElement) => el.id !== selectedFolder.id)


        this.removeFolderFromDirectoryMap(selectedFolder.directory);


        this.redraw();
        toast.success("Folder Deleted")
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Error: " + error.cause + error.message)
      } else if (error instanceof Error) {
        toast.error("Error" + error.name + " " + error.message);
      } else {
        toast.error("An unknown error occured");
        console.error(error);
      }

    }


  }


  //Private method from removing note internally 
  private removeFolderFromDirectoryMap(directory: string) {

    const dirArr = directory.split("/").filter(str => str !== "");
    let currentObj = this.directoryMapObject;
    for (const dir of dirArr) {
      //Before we reassign the currentObj to the last object, we will delete it, then return out of the method 
      if (dir === dirArr[dirArr.length - 1]) {
        delete currentObj[dir]
        return;
      }
      currentObj = currentObj[dir] as DirectoryMapObject;
    }


  }

  private removeNoteFromDirectoryMap(selectedFileIdx: number) {
    const selectedNote = this.getNoteByDisplayIndex(selectedFileIdx) as Note;

    const dirArr = selectedNote.directory.split("/").filter(str => str !== "");

    let currentObject = this.directoryMapObject;
    for (const dir of dirArr) {
      currentObject = currentObject[dir] as DirectoryMapObject;
    }

    currentObject.__notes = currentObject.__notes.filter(note => note.id !== selectedNote.id);
  }



  async deleteNote(selectedFileIdx: number) {

    const selectedNote = this.getNoteByDisplayIndex(selectedFileIdx);

    try {
      const response = await api({
        url: `/note/${selectedNote?.id}`,
        method: "delete",
      });
      if (response.status === 200) {
        this.removeNoteFromDirectoryMap(selectedFileIdx);
        this.displayLayout.splice(selectedFileIdx, 1)
        this.redraw();
        toast.success("Note deleted")
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Error: " + error.cause + error.message)
      } else if (error instanceof Error) {
        toast.error("Error" + error.name + " " + error.message);
      } else {
        toast.error("An unknown error occured");
        console.error(error);
      }

    }


  }


  private async addNoteToDirectoryMap(note: Note) {
    const dirArr = note.directory.split("/").filter(str => str !== "");

    let currentObj = this.directoryMapObject;
    for (const dir of dirArr) {
      if (!currentObj[dir]) currentObj[dir] = { __notes: [] };
      currentObj = currentObj[dir] as DirectoryMapObject;
    }
    currentObj.__notes.push(note);
  }


  async createNote(directory: string, title: string) {

    try {
      const response = await api({
        url: "/note",
        method: "post",
        data: {
          directory: directory,
          title: title,
        },
      });


      if (response.status === 200) {


        const { id, content, user_id } = response.data.note[0];

        const note = {
          directory: directory,
          title: title,
          updated_at: new Date(),
          content,
          id,
          user_id
        }

        let isNote;

        this.addNoteToDirectoryMap(note);
        //This is for determining if we need to add the first folder or just a note to the display array


        let fullPath = "";
        if (note.directory === "/") fullPath = "/" + title;
        else fullPath = note.directory + "/" + title;


        const dirArr = fullPath.split("/").filter(str => str !== "")

        if (dirArr.length === 1) isNote = true
        else isNote = false;

        if (isNote) {
          //Add note to display

          this.displayLayout.unshift({
            directory: "/",
            title: title,
            id,
            offset: 0,
            type: "note"
          })

        } else {
          //Add folder to display
          this.displayLayout.unshift({
            directory: "/",
            title: dirArr[0],
            id,
            offset: 0,
            type: "folder"
          })
        }






        toast.success("Note Created")
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Error: " + error.cause + error.message)
      } else if (error instanceof Error) {
        toast.error("Error" + error.name + " " + error.message);
      } else {
        toast.error("An unknown error occured");
        console.error(error);
      }

    }


  }

}

