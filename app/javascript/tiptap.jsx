import React, { useState, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Autosuggest from 'react-autosuggest'

// TIPTAP
//import BubbleMenu from '@tiptap/extension-bubble-menu'
import { useEditor, EditorContent, Editor, BubbleMenu, ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import Bold from '@tiptap/extension-bold'
//import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
//import Dropcursor from '@tiptap/extension-dropcursor'
//import Gapcursor from '@tiptap/extension-gapcursor'
//import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
//import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import Text from '@tiptap/extension-text'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Node, mergeAttributes, nodeInputRule, textblockTypeInputRule } from '@tiptap/core'

import {ImageButton, HelpButton, StepButton, IngredientButton, AddNoteButton, MeasuringButton, CharButton, BoldButton, ItalicButton, MoreButton, StrikeButton, LinkButton, SubscriptButton, SuperscriptButton} from './buttons'

// https://stackoverflow.com/questions/59769774/prosemirror-using-holes-contentdom-when-returning-dom-nodes-from-todom
// https://stackoverflow.com/questions/3066427/native-way-to-copy-all-child-nodes-to-an-other-element
// '@tiptap/core/src/utilities/elementFromString'
function elementFromString(value) {
  // add a wrapper to preserve leading and trailing whitespace
  const wrappedValue = `<body>${value}</body>`
  const body = new window.DOMParser().parseFromString(wrappedValue, 'text/html').body
  const container = document.createDocumentFragment();
  while (body.hasChildNodes()) {
    container.appendChild(body.removeChild(body.firstChild))
  }
  return container
}
function elementFromJSX(value) {
  const str = ReactDOMServer.renderToStaticMarkup(value);
  return elementFromString(str)
}

// MINE
import Quantity from './models/quantity'
import { Ingredient, Utils } from "./recipe_utils"
import { ajax } from "./utils"

const PageComponent = () => {
  //<span className="label" contentEditable={false}>React Component</span>
  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className="page">
        <NodeViewContent className="content" />
      </div>
    </NodeViewWrapper>
  )
}

export const Page = Node.create({
  name: 'page',
  content: 'block*',
  //priority: 1000,
  //group: 'block',
  //inline: true,
  //selectable: true,

  //addAttributes() {
  //  return {}
  //},

  //parseHTML() {
  //  return [{ tag: 'span[data-link-model]' },]
  //},

  //renderHTML({node, HTMLAttributes}) {
  //  return ['div', {class: 'page'}, '']
  //},
  renderHTML({ HTMLAttributes }) {
    return ['div', {class: 'page'}, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageComponent)
  },

  //addNodeView() {
  //  return ReactNodeViewRenderer(ModelLinkComponent)
  //},

  addCommands() {
    return {
      insertPage: () => ({ commands }) => {
        console.log("insertPage")
        //return commands.insertContent({type: 'page', attrs: {model: model, modelId: id}})
        return commands.insertContentAt(0, {type: 'page'})
        //return commands.insertContent(`<span data-link-model="${model}"></span>`)
      },
    }
  },
})

const Book = Node.create({
  name: 'book',
  topNode: true,
  content: 'page*',
})

const FloatingText = Node.create({
  name: 'floating-text',
  //priority: 1000,
  group: 'block',
  content: 'inline*',
  
  addAttributes() {
    return {
      x: {
        default: 0.0,
        parseHTML: element => element.getAttribute('x'),
        renderHTML: attrs => (attrs.x == null ? {} : {x: attrs.x}),
      },
      y: {
        default: 0.0,
        parseHTML: element => element.getAttribute('y'),
        renderHTML: attrs => (attrs.y == null ? {} : {y: attrs.x}),
      },
    }
  },
  
  addCommands() {
    return {
      insertFloatingText: () => ({ commands }) => {
        console.log("insertFloatingText")
        return commands.insertContent({type: 'floating-text'})
        //return commands.insertContent(`<span data-link-model="${model}"></span>`)
      },
    }
  },

  //parseHTML() {
  //  return [
  //    { tag: 'p' },
  //  ]
  //},

  renderHTML({node}) {
    return ['p', {}, 0]
  },

  //addCommands() {
  //  return {
  //    setParagraph: () => ({ commands }) => {
  //      return commands.setNode(this.name)
  //    },
  //  }
  //},

  //addKeyboardShortcuts() {
  //  return {
  //    'Mod-Alt-0': () => this.editor.commands.setParagraph(),
  //  }
  //},
})

export const BookExtensions = [
  Book, Page, Bold, Italic, FloatingText, Strike, Text, History, // Subscript, Superscript,
]
export class BookTiptap extends React.Component {
  constructor(props) {
    super(props)
    this.editor = null
  }
  componentDidMount() {
    // custom way to replace useEditor so it works with a react class instead of a react function component.
    this.editor = new Editor({
      extensions: BookExtensions,
      content: JSON.parse(gon[this.props.model][this.props.json_field]),
    })
    this.editor.on('transaction', () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.forceUpdate()
        })
      })
    })
    window.registerEditor(this.editor, this.props.model, this.props.json_field, this.props.html_field, this.props.url)
  }
  componentWillUnmount() {
    this.editor.destroy()
  }
  render() {
    return (
      <div className="book-editor">
        <EditorContent className="book-editor" editor={this.editor} />
      </div>
    )
  }
}

export const InlineDocument = Node.create({
  name: 'idoc',
  topNode: true,
  content: 'inline*',
})

// FIXME: This does not work... because is is not a block?
//const CustomItalic = Italic.extend({
//  addInputRules() {
//    return [
//      textblockTypeInputRule({
//        find: new RegExp("^(\\/)\\s$"),
//        type: this.type,
//      })
//    ]
//  },
//})

const ModelLinkComponent = ({node, updateAttributes}) => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const model = MODELS[node.attrs.model]
  if (!model) {return null;}

  if (node.attrs.modelId) {
    const record = model.records.find(f => f.id == node.attrs.modelId)
    if (model && record) {
      return (
        <NodeViewWrapper className="inline-block">
          <span data-link-model={node.attrs.model}>
            <a href={model.linkUrl(record)}>{model.linkLabel(record)}</a>
          </span>
        </NodeViewWrapper>
      )
    }
  }

  const inputFieldProps = {
    placeholder: model.placeholder,
    value,
    onChange: (e, {newValue}) => setValue(newValue),
    //ref: foodInputField,
  };
  
  const setModel = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log("Setting model!")
    updateAttributes({modelId: suggestion.id, linkName: suggestionValue})
  }

  // node.attrs....
  // FIXME: Autosuggest code here is a duplicate...
  //<input type="text" size="12" value={value} placeholder="Food name..." onChange={(e) => setValue(e.target.value)} />
  return (
    <NodeViewWrapper className="inline-block">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={({value}) => {
          const inputValue = value.trim().toLowerCase();
          const inputLength = inputValue.length;
         
          const matched = inputLength === 0 ? [] : model.records.filter(record =>
            record.name.includes(inputValue)
          )
          // Order the matches by relevance?
          setSuggestions(matched)
        }}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={(suggestion, { isHighlighted }) => (
          <div style={{ background: isHighlighted ? '#4095bf' : 'white', color: isHighlighted ? 'white' : 'black' }}>
            {suggestion.name}
          </div>
        )}
        onSuggestionSelected={setModel}
        inputProps={inputFieldProps}
      />
    </NodeViewWrapper>
  )
}

const MODELS = {
  food: {placeholder: 'Aliment...', records: gon.foodList, linkLabel: r => r.name, linkUrl: r => r.url},
  recipeKind: {placeholder: 'Sorte de recette...', records: gon.recipe_kinds, linkLabel: r => r.name, linkUrl: r => r.url},
  note: {records: gon.noteList, linkLabel: r => r.item_nb.toString(), linkUrl: r => `#note-${r.item_nb}`},
  //r = ['sup', {}, '[', ['a', {href: `#note-${note.item_nb}`}, note.item_nb.toString()], ']']
}

const LinkModel = Node.create({
  name: 'link-model',
  priority: 1000,
  group: 'inline',
  inline: true,
  selectable: true,

  addAttributes() {
    return {
      modelId: {
        default: null,
        parseHTML: element => element.getAttribute('model-id'),
        renderHTML: attributes => {
          if (attributes.modelId == null) {return {}}
          return {'model-id': attributes.modelId}
        },
      },
      model: {
        default: null,
        parseHTML: element => element.getAttribute('model'),
        renderHTML: attributes => {
          if (attributes.model == null) {return {}}
          return {'model': attributes.model}
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-link-model]' },]
  },

  renderHTML({node, HTMLAttributes}) {
    const HTMLAttrs = {'data-link-model': HTMLAttributes['model'], 'data-model-id': HTMLAttributes['model-id']}
    const model = MODELS[node.attrs.model]
    if (model && node.attrs.modelId) {
      const record = model.records.find(f => f.id == node.attrs.modelId)
      if (record) {
        let a = ['a', {href: model.linkUrl(record)}, model.linkLabel(record)]
        console.log(['span', HTMLAttrs, a])
        return ['span', HTMLAttrs, a]
      }
    }
    console.log(['span', HTMLAttrs, '[BROKEN LINK]'])
    return ['span', HTMLAttrs, '[BROKEN LINK]']
  },


  addNodeView() {
    return ReactNodeViewRenderer(ModelLinkComponent)
  },

  addCommands() {
    return {
      insertLinkModel: (model, id=null) => ({ commands }) => {
        console.log("insertLinkModel")
        return commands.insertContent({type: 'link-model', attrs: {model: model, modelId: id}})
        //return commands.insertContent(`<span data-link-model="${model}"></span>`)
      },
    }
  },
})

const CustomHeading = Heading.extend({
  addInputRules() {
    return [3,4,5].map(level => {
      return textblockTypeInputRule({
        find: new RegExp("^(\\\${"+(level-2)+"})\\s$"),
        type: this.type,
        getAttributes: {level},
      })
    })
  },
})
const ArticleHeading = Heading.extend({
  addInputRules() {
    return [2,3,4,5].map(level => {
      return textblockTypeInputRule({
        find: new RegExp("^(\\\${"+(level-1)+"})\\s$"),
        type: this.type,
        getAttributes: {level},
      })
    })
  },
})

//const InlineBlockNode = Node.create({
//  name: 'inlineblock',
//  priority: 1000,
//  group: 'block',
//  content: 'inline*',
//
//  parseHTML() {
//    return [
//      { tag: 'div' },
//    ]
//  },
//
//  renderHTML({ HTMLAttributes }) {
//    return ['div', mergeAttributes(class, HTMLAttributes), 0]
//  },
//})

function parseItemNbOrRaw(raw) {
}
        
const singleIngredientRegex = "(\\\d+|\\\(\\\d+[^-,\\\(\\\)\\\}\\\{]*\\\))"
//const signleIngredientRegex = '({(\d+|\(\d+[^\(\)\}\{]*\))})$'

const StepNode = Node.create({
  name: 'step',
  content: 'inline*',
  group: 'block',
  defining: true,

  addAttributes() {
    return {
      first: {
        default: false,
        parseHTML: element => element.getAttribute('data-step') || element.getAttribute('first'),
        renderHTML: attributes => {
          //return !attributes.first ? {} : {'data-step': attributes.first}
          if (attributes.first == null) {return {}}
          return {'first': attributes.first}
        },
      },
    }
  },

  parseHTML() {
    return [{tag: 'div[data-step]'}]
  },
  //parseHTML() {
  //  return this.options.levels
  //    .map((level: Level) => ({
  //      tag: `h${level}`,
  //      attrs: { level },
  //    }))
  //},

  renderHTML({ node, HTMLAttributes }) {
    //const hasLevel = this.options.levels.includes(node.attrs.level)
    //const level = hasLevel
    //  ? node.attrs.level
    //  : this.options.levels[0]

    //return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    return [`div`, {'data-step': HTMLAttributes['first']}, 0]
  },

  addCommands() {
    return {
      setStep: attributes => ({ commands }) => {
        return commands.setNode('step', attributes)
      },
      toggleStep: attributes => ({ commands }) => {
        return commands.toggleNode('step', 'paragraph', attributes)
      },
    }
  },

  //addKeyboardShortcuts() {
  //  return this.options.levels.reduce((items, level) => ({
  //    ...items,
  //    ...{
  //      [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level }),
  //    },
  //  }), {})
  //},

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: new RegExp(`^(#)\\s$`),
        type: this.type,
      })
    ]
  },
})

const IngredientNode = Node.create({
  name: 'ing',
  group: 'inline',
  inline: true,
  selectable: false,
  //atom: true, // What is this???

  addAttributes() {
    return {
      raw: {
        default: null,
        parseHTML: element => element.getAttribute('data-ingredient') || element.getAttribute('raw'),
        renderHTML: attributes => {
          if (!attributes.raw) {return {}}
          return {'raw': attributes.raw}
        },
      },
      //rawIngredient: {
      //  default: {'data-raw-ingredient': null},
      //  parseHTML: element => element.getAttribute('data-raw-ingredient'),
      //  renderHTML: attributes => {
      //    if (!attributes.rawIngredient) {return {}}

      //    return {'data-raw-ingredient': attributes.rawIngredient}
      //  },
      //},
    }
  },

  // HTMLAttributes here comes from attributes.renderHTML as defined in addAttributes().
  renderHTML({ node, HTMLAttributes }) {

    const ingredient = HTMLAttributes['raw']
    let text = null
    let food = null
    let name = null
    let comment = null
    if (ingredient.startsWith("(")) {
      const raw = ingredient.slice(1,-1)
      const [qty, foodName] = Quantity.parseQuantityAndFoodName(raw)
      text = Utils.prettyQuantityFor(qty.raw, foodName)
      food = gon.foodList.find(food => food.name == foodName)
      name = foodName
    } else {
      const ing = Object.values(gon.recipe.ingredients || {}).find(ing => ing.item_nb == ingredient)
      if (ing) {
        text = Utils.prettyQuantityFor(ing.raw, ing.name)
        food = ing.food
        comment = ing.comment
        name = ing.name
      }
    }
    let children = []
    if (text && text != '') {children.push(text)}
    if (food && food.is_public) {
      children.push(['span', {class: 'food-name'}, ['a', {href: food.url}, name]])
    } else {
      children.push(['span', {class: 'food-name'}, name])
    }
    if (comment) { children.push(elementFromString(' '+comment)) }
    return ['span', {'data-ingredient': HTMLAttributes['raw']}, ...children]
  },

  //addNodeView() {
  //  return ({ editor, node, getPos }) => {

  //    const dom = document.createElement('div')
  //    dom.innerHTML = '<b>TESTING 1212</b>'
  //    dom.classList.add('node-view')

  //    return {dom,}
  //  }
  //},

  parseHTML() {
    return [{tag: 'span[data-ingredient]'}]
  },

  addCommands() {
    //.insertContent('Example Text')
    return {
      insertIngredient: (ingId) => ({ commands }) => {
        console.log("insertIngredient")
        console.log("raw", ingId)
        return commands.insertContent({type: 'ing', attrs: {raw: ingId.toString()}})
        //return commands.insertContent(`<span data-ingredient="${ingId}"/>`)
        //return commands.setNode('ingredient')
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: new RegExp(`({(${singleIngredientRegex})})$`),
        type: this.type,
        getAttributes: match => {
          const [,,inner] = match
          console.log("MATCH", match)
          console.log("INNER", inner)
          return {raw: inner}

          //const ing = Object.values(gon.recipe.ingredients).find(ing => ing.item_nb == itemNb)
          //if (!ing) {return {}}
          //console.log("ingredient", ing.id)
          //return {ingredient: ing.id}
        },
      }),
      //nodeInputRule({
      //  find: /({(\(\d+[^\(\)\}\{]*)}\))$/,
      //  type: this.type,
      //  getAttributes: match => {
      //    console.log(match)
      //    const [,,itemNb] = match

      //    const raw = match.slice(1, -1)
      //    console.log(raw)
      //    //const ing = new Ingredient({raw})
      //    return {'rawIngredient': raw}
      //  },
      //}),
    ]
  },

})

const IngredientListNode = Node.create({
  name: 'ings',
  group: 'block',
  //inline: true,
  //selectable: false,
  //atom: true, // What is this???

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      raw: {
        default: null,
        parseHTML: element => element.getAttribute('data-ingredients') || element.getAttribute('raw'),
        renderHTML: attributes => {
          if (!attributes.raw) {return {}}
          return {'raw': attributes.raw}
          //let ings = []
          //let s = attributes.ingredients.split(',')
          //s.forEach(c => {
          //  if (c.includes('-')) {
          //    let [start, end] = c.split('-').map(i => parseInt(i))
          //    for (let i = start; i <= end; i++) {
          //      ings.push(i)
          //    }
          //  } else {
          //    ings.push(c)
          //  }
          //})
          ////let ingIds = nbs.map(itemNb => (
          ////  Object.values(gon.recipe.ingredients).find(ing => ing.item_nb == itemNb)
          ////)).map(ing => ing.id)
          //return {'raw': ings.join(',')}
        },
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const raw = HTMLAttributes['raw']
    if (!raw) {return ['span', {}, 'FIXME']}
    let ings = []
    let s = raw.split(',')
    s.forEach(c => {
      if (c.includes('-')) {
        let [start, end] = c.split('-').map(i => parseInt(i))
        for (let i = start; i <= end; i++) {
          ings.push(i.toString())
        }
      } else {
        ings.push(c)
      }
    })
    let list = ings.map(ingredient => {
      if (ingredient.startsWith("(")) {
        return ['li', HTMLAttributes, "TODO"]
      } else {
        const ing = Object.values(gon.recipe.ingredients || {}).find(ing => ing.item_nb == ingredient)
        if (ing) {
          let children = []
          let text = Utils.prettyQuantityFor(ing.raw, ing.name)
          if (text && text != '') {children.push(text)}
          if (ing.food && ing.food.is_public) {
            children.push(['span', {class: 'food-name'}, ['a', {href: ing.food.url}, ing.name]])
          } else {
            children.push(['span', {class: 'food-name'}, ing.name])
          }
          if (ing.comment) {children.push(elementFromString(' '+ing.comment))}
          return ['li', {'data-ingredient': ing.id}, ...children]
        }
      }
    })
    if (!list || list.length == 0) {list = ''}
    // Return: ['tagName', {attributeName: 'attributeValue'}, child1, child2, ...children]
    return [
      'span',
      { 'data-ingredients': HTMLAttributes['raw']},
      ['ul', {}, ...list]
    ]
  },

  parseHTML() {
    return [{tag: 'span[data-ingredients]'}]
  },

  addInputRules() {
    return [
      nodeInputRule({
        //find: /({(\d+(,\d+|-\d+)+)})$/,
        find: new RegExp(`({(${singleIngredientRegex}(,${singleIngredientRegex}|-${singleIngredientRegex})+)})$`),
        type: this.type,
        getAttributes: match => {
          const [,,inner] = match
          console.log("REGEX", `({(${singleIngredientRegex}(,${singleIngredientRegex}|-${singleIngredientRegex})+)})$`)
          console.log("MATCH", match)
          console.log("INNER", inner)
          return { raw: inner }
        },
      }),
    ]
  },

})

const Toolbar = ({ editor }) => {
  if (!editor) {return null}

  const width = 24
  const height = 24

  // REALLY UGLY
  let selectedHeader = "0";
  if (editor.isActive('heading', { level: 3 })) {selectedHeader = "3"}
  if (editor.isActive('heading', { level: 4 })) {selectedHeader = "4"}
  if (editor.isActive('heading', { level: 5 })) {selectedHeader = "5"}
  // selectedHeader = editor.getAttributes('heading').level // Does not work

  return (
    <div className="toolbar" style={{display: "flex"}}>
      <Inline padding="0 1.5em">
        <select value={selectedHeader} style={{display: "flex", alignItems: "center"}} onChange={(e) => {
          let val = parseInt(e.target.value)
          if (!val) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().toggleHeading({ level: val }).run()
          }
        }}>
          <option value="3">Titre 1</option>
          <option value="4">Titre 2</option>
          <option value="5">Titre 3</option>
          <option value="0">Normal</option>
        </select>
      </Inline>
      <Inline padding="0 1.5em">
        <StepButton editor={editor} width={width} height={height} />
        <IngredientButton editor={editor} width={width} height={height} />
        <MeasuringButton editor={editor} width={width} height={height} />
        <AddNoteButton editor={editor} width={width} height={height} />
        <LinkButton editor={editor} width={width} height={height} />
        <CharButton editor={editor} width={width} height={height} />
        <MoreButton editor={editor} width={width} height={height} />
      </Inline>
      <Inline padding="0 1.5em">
        <BoldButton editor={editor} width={width} height={height} />
        <ItalicButton editor={editor} width={width} height={height} />
        <StrikeButton editor={editor} width={width} height={height} />
      </Inline>
      <Inline flexGrow="1"></Inline>
      <HelpButton editor={editor} width={width} height={height} />
    </div>
  )
}

const ArticleToolbar = ({ editor }) => {
  if (!editor) {return null}

  const width = 24
  const height = 24

  // REALLY UGLY
  let selectedHeader = "0";
  if (editor.isActive('heading', { level: 2 })) {selectedHeader = "2"}
  if (editor.isActive('heading', { level: 3 })) {selectedHeader = "3"}
  if (editor.isActive('heading', { level: 4 })) {selectedHeader = "4"}
  if (editor.isActive('heading', { level: 5 })) {selectedHeader = "5"}
  // selectedHeader = editor.getAttributes('heading').level // Does not work

  return (
    <div className="toolbar" style={{display: "flex"}}>
      <Inline padding="0 1.5em">
        <select value={selectedHeader} style={{display: "flex", alignItems: "center"}} onChange={(e) => {
          let val = parseInt(e.target.value)
          if (!val) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().toggleHeading({ level: val }).run()
          }
        }}>
          <option value="2">Titre 1</option>
          <option value="3">Titre 2</option>
          <option value="4">Titre 3</option>
          <option value="5">Titre 4</option>
          <option value="0">Normal</option>
        </select>
      </Inline>
      <Inline padding="0 1.5em">
        <ImageButton editor={editor} width={width} height={height} />
        <AddNoteButton editor={editor} width={width} height={height} />
        <LinkButton editor={editor} width={width} height={height} />
        <CharButton editor={editor} width={width} height={height} />
        <MoreButton editor={editor} width={width} height={height} />
      </Inline>
      <Inline padding="0 1.5em">
        <BoldButton editor={editor} width={width} height={height} />
        <ItalicButton editor={editor} width={width} height={height} />
        <StrikeButton editor={editor} width={width} height={height} />
      </Inline>
      <Inline flexGrow="1"></Inline>
      <HelpButton editor={editor} width={width} height={height} />
    </div>
  )
}

export const ArticleExtensions = [
  Bold, Italic, Document, Paragraph, Strike, Text, ArticleHeading, History, // Subscript, Superscript,
]
export const ArticleTiptap = ({model, json_field, html_field, url}) => {
  const editor = useEditor({
    extensions: ArticleExtensions,
    content: JSON.parse(gon[model][json_field]),
  })
  useEffect(() => {
    window.registerEditor(editor, model, json_field, html_field, url)
  }, [editor])

  return (
    <div className="article-editor">
      <ArticleToolbar editor={editor} />
      <EditorContent className="article-editor" editor={editor} />
    </div>
  )
}

export const RecipeExtensions = [
  Bold, Italic, Document, Paragraph, Strike, Text, CustomHeading,
  History, IngredientNode, IngredientListNode, StepNode, LinkModel
]
export const recipeEditor = (content) => {
  return {
    extensions: RecipeExtensions,
    content: content,
  }
}
export const Tiptap = ({content, model, json_field, html_field, url}) => {
  const editor = useEditor(recipeEditor(content))

  useEffect(() => {
    window.registerEditor(editor, model, json_field, html_field, url)
  }, [editor])

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export const BubbleExtensions = [Bold, Italic, Strike, InlineDocument, History, Text, LinkModel]
export const BubbleTiptap = ({content, model, json_field, html_field, url}) => {

  const width = 24
  const height = 24

  const editor = useEditor({
    extensions: BubbleExtensions,
    content: content,
  })

  useEffect(() => {
    window.registerEditor(editor, model, json_field, html_field, url)
  }, [editor])

  return (
    <>
      {editor && <BubbleMenu editor={editor}>
        <BoldButton editor={editor} width={width} height={height} />
        <ItalicButton editor={editor} width={width} height={height} />
        <StrikeButton editor={editor} width={width} height={height} />
        <LinkButton editor={editor} width={width} height={height} />
      </BubbleMenu>}
      <EditorContent editor={editor} style={{width: "100%"}} />
    </>
  )
}

export const DescriptionExtensions = [Bold, Italic, Strike, Document, Paragraph, History, Text, LinkModel]
export const DescriptionTiptap = ({content, model, json_field, html_field, url}) => {

  const width = 24
  const height = 24

  const editor = useEditor({
    extensions: DescriptionExtensions,
    content: content,
  })

  useEffect(() => {
    window.registerEditor(editor, model, json_field, html_field, url)
  }, [editor])

  return (
    <div className="recipe-kind-editor">
      {editor && <BubbleMenu editor={editor}>
        <BoldButton editor={editor} width={width} height={height} />
        <ItalicButton editor={editor} width={width} height={height} />
        <StrikeButton editor={editor} width={width} height={height} />
        <LinkButton editor={editor} width={width} height={height} />
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  )
}

export class ModificationsHandler {
  constructor() {
    this.editors = new Set()
    window.onbeforeunload = this.preventLeavingWithoutModifications
  }

  registerEditor(editor, model, json_field, html_field, url) {
    console.log('registeringEditor')
    if (!editor || this.editors.has(editor)) {return}
    console.log('registeringEditor has editor')
    this.editors.add(editor)
    editor.savedJSON = JSON.stringify(editor.getJSON())
    //editor.savedJSON = model[json_field]
    editor.updateModel = model
    editor.jsonField = json_field
    editor.htmlField = html_field
    editor.updateUrl = url
    console.log("updateURL", editor.updateUrl)
    editor.on('update', ({ editor }) => {
      editor.isDirty = true
    })
    this.updateChecking()
  }

  updateChecking() {
    let editors = this.editors
    if (this.checkingFunction) {
      clearInterval(this.checkingFunction)
    }
    this.checkingFunction = setInterval(function() {
      //for (let editor of editors) {
      for (let it = editors.values(), editor=null; editor=it.next().value; ) {
        if (!editor.isDirty) {continue}
        editor.isDirty = false
        let json = JSON.stringify(editor.getJSON())
        if (json != editor.savedJSON) {
          console.log('Saving changes for '+editor.updateModel+' '+editor.jsonField);

          let data = new FormData()
          data.append(`${editor.updateModel}[${editor.jsonField}]`, json)
          data.append(`${editor.updateModel}[${editor.htmlField}]`, editor.getHTML())
          ajax({url: editor.updateUrl, type: 'PATCH', data: data, success: () => {
            editor.savedJSON = json
          }})
        }
      }
    }, 1*1000);
  }

  preventLeavingWithoutModifications() {
    for (let editor in this.editors) {
      if (editor && JSON.stringify(editor.getJSON()) != editor.savedJSON) {
        return 'There are unsaved changes. Are you sure you want to leave?';
      }
    }
  }
}

  //addNodeView() {
  //  return (args) => {
  //    const {editor, node, getPos, HTMLAttributes, decorations, extension} = args
  //    console.log(args)

  //    const dom = document.createElement('div')
  //    dom.innerHTML = '<b>TESTING 1212</b>'
  //    dom.classList.add('node-view')

  //    return {dom,}
  //  }
  //},
