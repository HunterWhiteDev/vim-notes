import _debounce from "lodash/debounce";
import { ViewPlugin, ViewUpdate } from "@codemirror/view";
import { EditorView } from "codemirror";

type GlobalConfigState = {
  onUpdate: (content: string) => void;
};

let globalConfigState: GlobalConfigState;

const viewPlugin = ViewPlugin.fromClass(
  class {
    config;
    constructor(view: EditorView) {
      this.config = globalConfigState;
      console.log(this.config);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        const formatedString = update.state.doc.toString();
        console.log({ formatedString });
        globalConfigState.onUpdate(formatedString);
      }
    }
  },
  {},
);
export default function (config: GlobalConfigState) {
  globalConfigState = config;
  return viewPlugin;
}
