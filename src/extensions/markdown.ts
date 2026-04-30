import {
  ViewUpdate,
  EditorView,
  ViewPlugin,
  DecorationSet,
  Decoration,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { EditorState, Range } from "@codemirror/state";

function decorations(view: EditorView) {
  let decorationsArr: Range<Decoration>[] = [];

  //TODO: Images, Links, Urls, Html

  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        switch (node.name) {
          case "EmphasisMark":
          case "StrongEmphasisMark":
          case "SubscriptMark":
          case "QuoteMark":
          case "CodeMark":
          case "HeaderMark": {
            const cursorPostion = view.state.selection.ranges[0].from;

            const parentNode = node.node.parent;
            const grandParent = node.node.parent?.parent;

            if (!parentNode) return;

            let parentNodeFrom = parentNode.from;
            let parentNodeTo = parentNode.to;

            if (grandParent?.name === "Emphasis") {
              parentNodeFrom = grandParent.from;
              parentNodeTo = grandParent.to;
            }

            if (
              cursorPostion >= parentNodeFrom &&
              cursorPostion <= parentNodeTo
            ) {
              return;
            } else {
              const deco = Decoration.replace({
                inclusive: true,
              });
              const range = deco.range(node.from, node.to);
              decorationsArr.push(range);
            }

            break;
          }

          case "StrongEmphasis": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-weight: bold;",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);
          }
          case "Emphasis": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-style: italic;",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);
          }

          case "Subscript": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "text-decoration: line-through",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);
            break;
          }
          case "Blockquote": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style:
                  "background-color: #1f2328; border-left: 0.25rem solid gray; padding-left: 0.25rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);

            break;
          }
          case "ATXHeading1": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-size: 2rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);
            break;
          }
          case "ATXHeading2": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-size: 1.75rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);
          }
          case "ATXHeading3": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-size: 1.5rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);

            break;
          }
          case "ATXHeading4": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-size: 1.25rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);

            break;
          }
          case "ATXHeading5": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-size: 1rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);

            break;
          }
          case "ATXHeading6": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-size: 0.75rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);

            break;
          }
          case "InlineCode": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "background-color: #1f2328; border-radius: 0.25rem",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);

            break;
          }
          case "FencedCode": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "background-color: #1f2328; border-radius: 0.25rem",
              },
            });

            const range = deco.range(node.from, node.to);

            decorationsArr.push(range);

            break;
          }
        }
      },
    });
  }

  decorationsArr.sort((a: Range<Decoration>, b: Range<Decoration>) => {
    return a.from >= b.from ? 1 : -1;
  });

  return Decoration.set(decorationsArr, true);
}

const markdownPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = decorations(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.viewportChanged ||
        update.selectionSet ||
        syntaxTree(update.startState) != syntaxTree(update.state)
      )
        this.decorations = decorations(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

export default markdownPlugin;
