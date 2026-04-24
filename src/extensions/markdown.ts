import {
  ViewUpdate,
  EditorView,
  ViewPlugin,
  DecorationSet,
  Decoration,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { EditorState, Range } from "@codemirror/state";

function markDecorations(state: EditorState, node) {
  const decorationsArr: Range<Decoration>[] = [];

  syntaxTree(state).iterate({
    from: node.from,
    to: node.to,
    enter: (markNode) => {
      switch (markNode.name) {
        case "EmphasisMark":
        case "StrongEmphasisMark":
        case "SubscriptMark":
        case "QuoteMark":
        case "HeaderMark": {
          const cursorPostion = state.selection.ranges[0].from;

          //If we are currently within range of the element dont hide the mark
          if (cursorPostion >= node.from && cursorPostion <= node.to) {
            return;
          }

          const deco = Decoration.mark({
            tagName: "span",
            attributes: {
              style: "font-size: 0",
            },
          });
          const range = deco.range(markNode.from, markNode.to);
          decorationsArr.push(range);
        }
      }
    },
  });

  return decorationsArr;
}

function decorations(view: EditorView) {
  let decorationsArr: Range<Decoration>[] = [];

  //TODO: Images, Links, Urls, Html

  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        switch (node.name) {
          case "StrongEmphasis": {
            const deco = Decoration.mark({
              tagName: "span",
              attributes: {
                style: "font-weight: bold;",
              },
            });
            const range = deco.range(node.from, node.to);
            decorationsArr.push(range);
            decorationsArr.push(...markDecorations(view.state, node));
            break;
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
            decorationsArr.push(...markDecorations(view.state, node));
            break;
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
            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
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
            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
            break;
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

            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
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

            decorationsArr.push(...markDecorations(view.state, node));
            break;
          }

          //The following code will fall through all Mark cases so  the elements can be hidden
        }
      },
    });
  }

  decorationsArr.sort((a: Range<Decoration>, b: Range<Decoration>) => {
    return a.from >= b.from ? 1 : -1;
  });

  return Decoration.set(decorationsArr);
}

const markdownPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView, config) {
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
    //Watch for click and button events so that we update the decorations as soon as we
    //move the cursor into the right spot
    eventHandlers: {
      keydown: function (e, view) {
        this.decorations = decorations(view);
      },
      mousedown: function (e, view) {
        this.decorations = decorations(view);
      },
    },
  },
);

export default markdownPlugin;
