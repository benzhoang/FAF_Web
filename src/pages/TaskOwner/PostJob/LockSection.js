import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

export const LockSection = Extension.create({
  name: "lockSection",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        filterTransaction(transaction, state) {
          if (!transaction.docChanged) return true;

          const { from, to } = transaction.selection;
          let blocked = false;

          state.doc.nodesBetween(from, to, (node) => {
            if (node.attrs && node.attrs["data-locked"]) {
              blocked = true;
            }
          });

          return !blocked; // ❌ chặn nếu đụng vùng khóa
        },
      }),
    ];
  },
});
