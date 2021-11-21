import {Schema, DOMParser, Node as ProseMirrorNode, Fragment, ParseOptions} from 'prosemirror-model'

const inlineSchema = new Schema({
  nodes: {
    doc: {
      content: "inline*"
      //content: "block+"
    },
    text: {
      group: "inline",
    },
  },
  //marks: {
  //  shouting: {
  //    toDOM() { return ["shouting", 0] },
  //    parseDOM: [{tag: "shouting"}]
  //  },
  //  link: {
  //    attrs: {href: {}},
  //    toDOM(node) { return ["a", {href: node.attrs.href}, 0] },
  //    parseDOM: [{tag: "a", getAttrs(dom) { return {href: dom.href} }}],
  //    inclusive: false
  //  }
  //}
})

