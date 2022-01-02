import React, { useState, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

import Autosuggest from 'react-autosuggest'

// TIPTAP
//import BubbleMenu from '@tiptap/extension-bubble-menu'
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
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

import {ImageButton, HelpButton, StepButton, IngredientButton, AddNoteButton, MeasuringButton, CharButton, BoldButton, ItalicButton, MoreButton, StrikeButton, LinkButton, SubscriptButton, SuperscriptButton} from 'buttons'

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
import Quantity from 'models/quantity'
import { Ingredient, Utils } from "recipe_utils"

export const InlineDocument = Node.create({
  name: 'inlinedoc',
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
  const placeholder = model.placeholder
  const modelNamePlural = model.listName

  const inputFieldProps = {
    placeholder: placeholder,
    value,
    onChange: (e, {newValue}) => setValue(newValue),
    //ref: foodInputField,
  };
  
  const setModel = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log("Setting model!")
    updateAttributes({modelId: suggestion.id, linkName: suggestionValue})
  }

  console.log(node)

  if (node.attrs.modelId) {
    const model = gon[modelNamePlural].find(f => f.id == node.attrs.modelId)
    if (model) {
      return (
        <NodeViewWrapper className="inline-block">
          <a href={model.url}>{model.name}</a>
        </NodeViewWrapper>
      )
    }
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
         
          const matched = inputLength === 0 ? [] : gon[modelNamePlural].filter(model =>
            model.name.includes(inputValue)
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
  food: {listName: 'foodList', placeholder: 'Aliment...'},
  recipeKind: {listName: 'recipe_kinds', placeholder: 'Sorte de recette...'},
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
        parseHTML: element => element.getAttribute('data-model-id'),
        renderHTML: attributes => {
          if (attributes.modelId == null) {return {}}
          return {'data-model-id': attributes.modelId}
        },
      },
      model: {
        default: null,
        parseHTML: element => element.getAttribute('data-link-model'),
        renderHTML: attributes => {
          if (attributes.model == null) {return {}}
          return {'data-link-model': attributes.model}
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-link-model]' },]
  },

  renderHTML({node, HTMLAttributes}) {
    const model = MODELS[node.attrs.model]
    if (model && node.attrs.modelId) {
      const record = gon[model.listName].find(f => f.id == node.attrs.modelId)
      console.log("record", record)
      console.log("model.listName", model.listName)
      console.log("modelId", node.attrs.modelId)
      if (record) {
        let a = ['a', {href: record.url}, record.name]
        console.log(['span', HTMLAttributes, a])
        return ['span', HTMLAttributes, a]
      }
    }
    console.log(['span', HTMLAttributes, '[BROKEN LINK]'])
    return ['span', HTMLAttributes, '[BROKEN LINK]']
  },


  addNodeView() {
    return ReactNodeViewRenderer(ModelLinkComponent)
  },

  addCommands() {
    return {
      insertLinkModel: (model) => ({ commands }) => {
        console.log("insertLinkModel")
        return commands.insertContent(`<span data-link-model="${model}"></span>`)
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

export const CustomLink = Node.create({
  name: 'link',
  priority: 1000,
  group: 'inline',
  inline: true,
  selectable: false,

  addAttributes() {
    return {
      linkRaw: {
        default: null,
        parseHTML: element => element.getAttribute('data-link-raw'),
        renderHTML: attributes => {
          if (attributes.linkRaw == null) {return {}}
          return {'data-link-raw': attributes.linkRaw}
        },
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'span[data-link-raw]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    console.log('CustomLink.renderHTML', HTMLAttributes)
    let r = ''
    const raw = HTMLAttributes['data-link-raw']
    if (raw.startsWith("note:")) {
      const nb = parseInt(raw.slice(5).trim())
      const note = Object.values(gon.recipe.notes || {}).find(note => note.item_nb == nb)
      if (note) {
        r = ['sup', {}, '[', ['a', {href: `#note-${note.item_nb}`}, note.item_nb.toString()], ']']
      }
    }
    return ['span', HTMLAttributes, r]
  },

  addCommands() {
    return {
      insertLink: (raw) => ({ commands }) => {
        console.log("insertLink")
        return commands.insertContent(`<span data-link-raw="${raw}"></span>`)
      },
    }
  },

  //addCommands() {
  //  return {
  //    setLink: attributes => ({ commands }) => {
  //      return commands.setMark('link', attributes)
  //    },
  //    toggleLink: attributes => ({ commands }) => {
  //      return commands.toggleMark('link', attributes, { extendEmptyMarkRange: true })
  //    },
  //    unsetLink: () => ({ commands }) => {
  //      return commands.unsetMark('link', { extendEmptyMarkRange: true })
  //    },
  //  }
  //},

  //addPasteRules() {
  //  return [
  //    markPasteRule({
  //      find: text => find(text)
  //        .filter(link => link.isLink)
  //        .map(link => ({
  //          text: link.value,
  //          index: link.start,
  //          data: link,
  //        })),
  //      type: this.type,
  //      getAttributes: match => ({
  //        href: match.data?.href,
  //      }),
  //    }),
  //  ]
  //},

  //addProseMirrorPlugins() {
  //  const plugins = []

  //  if (this.options.openOnClick) {
  //    plugins.push(
  //      new Plugin({
  //        key: new PluginKey('handleClickLink'),
  //        props: {
  //          handleClick: (view, pos, event) => {
  //            const attrs = this.editor.getAttributes('link')
  //            const link = (event.target as HTMLElement)?.closest('a')

  //            if (link && attrs.href) {
  //              window.open(attrs.href, attrs.target)

  //              return true
  //            }

  //            return false
  //          },
  //        },
  //      }),
  //    )
  //  }

  //  if (this.options.linkOnPaste) {
  //    plugins.push(
  //      new Plugin({
  //        key: new PluginKey('handlePasteLink'),
  //        props: {
  //          handlePaste: (view, event, slice) => {
  //            const { state } = view
  //            const { selection } = state
  //            const { empty } = selection

  //            if (empty) {
  //              return false
  //            }

  //            let textContent = ''

  //            slice.content.forEach(node => {
  //              textContent += node.textContent
  //            })

  //            const link = find(textContent)
  //              .find(item => item.isLink && item.value === textContent)

  //            if (!textContent || !link) {
  //              return false
  //            }

  //            this.editor.commands.setMark(this.type, {
  //              href: link.href,
  //            })

  //            return true
  //          },
  //        },
  //      }),
  //    )
  //  }

  //  return plugins
  //},
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
        parseHTML: element => element.getAttribute('data-step'),
        renderHTML: attributes => {
          if (attributes.first == null) {return {}}
          return {'data-step': attributes.first}
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
    return [`div`, HTMLAttributes, 0]
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
  name: 'ingredient',
  group: 'inline',
  inline: true,
  selectable: false,
  //atom: true, // What is this???

  addAttributes() {
    return {
      ingredient: {
        default: null,
        parseHTML: element => element.getAttribute('data-ingredient'),
        renderHTML: attributes => {
          if (!attributes.ingredient) {return {}}
          return {'data-ingredient': attributes.ingredient}
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

    const ingredient = HTMLAttributes['data-ingredient']
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
    return ['span', HTMLAttributes, ...children]
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
        return commands.insertContent(`<span data-ingredient="${ingId}"/>`)
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
          console.log("MATCH", match)
          console.log("INNER", inner)
          const [,,inner] = match
          return {ingredient: inner}

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
  name: 'ingredient-list',
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
      ingredientIds: {
        default: null,
        parseHTML: element => element.getAttribute('data-ingredients'),
        renderHTML: attributes => {
          if (!attributes.ingredientIds) {return {}}

          return {'data-ingredients': attributes.ingredientIds}
        },
      },
      ingredients: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.ingredients) {return {}}
          let ings = []
          let s = attributes.ingredients.split(',')
          s.forEach(c => {
            if (c.includes('-')) {
              let [start, end] = c.split('-').map(i => parseInt(i))
              for (let i = start; i <= end; i++) {
                ings.push(i)
              }
            } else {
              ings.push(c)
            }
          })
          //let ingIds = nbs.map(itemNb => (
          //  Object.values(gon.recipe.ingredients).find(ing => ing.item_nb == itemNb)
          //)).map(ing => ing.id)
          return {'data-ingredients': ings.join(',')}
        },
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const ingredients = HTMLAttributes['data-ingredients']
    const ids = HTMLAttributes['data-ingredients'] || []
    let list = ids.split(',').map(ingredient => {
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
      mergeAttributes({ 'data-ingredients': '' }, this.options.HTMLAttributes, HTMLAttributes),
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
          return { ingredients: inner }
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

export const ArticleTiptap = ({model, field, url}) => {
  const editor = useEditor({
    extensions: [Bold, Italic, Document, Paragraph, Strike, Text, ArticleHeading, CustomLink,
      History, IngredientNode, IngredientListNode, StepNode,// Subscript, Superscript,
    ],
    content: gon[model][field],
  })
  // Ugly to call this at every render, but I don't know where else to put it.
  window.registerEditor(editor, model, field, url)

  return (
    <div className="article-editor">
      <ArticleToolbar editor={editor} />
      <EditorContent className="article-editor" editor={editor} />
    </div>
  )
}

export const Tiptap = ({model, field, url}) => {
  const editor = useEditor({
    extensions: [Bold, Italic, Document, Paragraph, Strike, Text, CustomHeading, CustomLink,
      History, IngredientNode, IngredientListNode, StepNode, LinkModel// Subscript, Superscript,
    ],
    content: gon[model][field],
  })
  // Ugly to call this at every render, but I don't know where else to put it.
  window.registerEditor(editor, model, field, url)

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export const BubbleTiptap = ({content, model, field, url}) => {

  const width = 24
  const height = 24

  const editor = useEditor({
    extensions: [Bold, Italic, Strike, InlineDocument, History, Text, CustomLink],
    content: content,
  })
  // Ugly to call this at every render, but I don't know where else to put it.
  window.registerEditor(editor, model, field, url)

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

export const DescriptionTiptap = ({content, model, field, url}) => {

  const width = 24
  const height = 24

  const editor = useEditor({
    extensions: [Bold, Italic, Strike, Document, Paragraph, History, Text, CustomLink, LinkModel],
    content: content,
  })
  // Ugly to call this at every render, but I don't know where else to put it.
  window.registerEditor(editor, model, field, url)

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

  registerEditor(editor, model, field, url) {
    if (!editor || this.editors.has(editor)) {return}
    this.editors.add(editor)
    editor.savedHTML = editor.getHTML()
    editor.updateModel = model
    editor.updateField = field
    editor.updateUrl = url
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
        let current = editor.getHTML()
        if (current != editor.savedHTML) {
          console.log('Saving changes');

          let data = new FormData()
          data.append(`${editor.updateModel}[${editor.updateField}]`, current)
          Rails.ajax({url: editor.updateUrl, type: 'PATCH', data: data, success: () => {
            editor.savedHTML = current
          }})
        }
      }
    }, 5*1000);
  }

  preventLeavingWithoutModifications() {
    for (let editor in this.editors) {
      if (editor && editor.getHTML() != editor.savedHTML) {
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
