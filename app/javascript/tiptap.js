import React, { useState, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'

import {Block, Inline, InlineBlock, Row, Col, InlineRow, InlineCol, Grid} from 'jsxstyle'

// TIPTAP
//import BubbleMenu from '@tiptap/extension-bubble-menu'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
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
        find: new RegExp("^(\\\${"+(level-2)+"})\\s$"),
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

const HelpButton = ({editor, width, height}) => (
  <button style={{padding: "0 1em"}}>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="#0d6efd" className="bi bi-question-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
    </svg>
  </button> 
)
const StepButton = ({editor, width, height}) => (
  <button type="button" title="Ajouter une étape" onClick={() => editor.chain().focus().toggleStep().run()} className={editor.isActive('step') ? 'is-active' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-hash" viewBox="0 0 16 16">
      <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
    </svg>
  </button> 
)
const IngredientButton = ({editor, width, height}) => (
  <span className="dropdown">
    <button type="button" title="Ajouter un ingrédient ou une liste d'ingrédient" className="dropdown-toggle" id="ingDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <svg className="bi bi-egg" width={width} height={height} fill="currentColor" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
       <g>
        <path d="m9.5254 1.4576-2.7019 0.02397c-0.25329 0.0042-0.47958 0.10552-0.6499 0.36509-0.088322 0.22538-0.28139 0.57098 0 0.76348 0.21838 0.10502 0.48117 0.22845 0.56517 0.39821 0.065074 0.33662 3.551e-4 1.0685 0 1.6059-0.076506 1.4087-1.1194 1.3293-1.0777 2.2671v7.3898h5.9322v-7.4576c-0.0034-1.2097-0.7028-0.99755-1.0501-2.4608-0.078413-0.51526-0.16055-0.96165-0.095883-1.3276 0.08517-0.18291 0.38493-0.16276 0.51055-0.51049v-0.64035c-0.14541-0.34332-0.61106-0.34145-0.88084-0.37387z" fill="none" stroke="#000" strokeWidth=".5"/>
       </g>
       <g>
        <path d="m3.964 15.171a2.9026 2.9176 0 0 1-2.9026-2.9176c0-1.1414 0.40057-2.501 1.0113-3.5712 0.3042-0.53276 0.64555-0.96749 0.98922-1.2628 0.34716-0.2976 0.65368-0.4178 0.90214-0.4178 0.24847 0 0.55499 0.12021 0.90214 0.4178 0.34367 0.29526 0.68503 0.72999 0.98922 1.2628 0.61072 1.0702 1.0113 2.4298 1.0113 3.5712a2.9026 2.9176 0 0 1-2.9026 2.9176zm0 0.58353a3.4832 3.5012 0 0 0 3.4832-3.5012c0-2.5173-1.7416-5.8353-3.4832-5.8353-1.7416 0-3.4832 3.3179-3.4832 5.8353a3.4832 3.5012 0 0 0 3.4832 3.5012z" strokeWidth=".58203"/>
        <g transform="translate(-.80521 1.0023)" fill="none" stroke="#000" strokeWidth=".5">
         <path d="m8.7489 9.1926v4.8898h5.2973v-4.8659z"/>
         <path d="m8.6557 9.1545 2.397-1.9415h4.8659l-1.9655 1.9655"/>
         <path d="m16.262 6.9587 0.0085 5.0159-2.1752 2.1906"/>
        </g>
        <g fill="#fff" stroke="#000003" strokeWidth=".011985">
         <path d="m3.6012 15.137c-0.60801-0.083665-1.1744-0.35599-1.6158-0.77681-0.43851-0.41814-0.71637-0.91284-0.85735-1.5264-0.056877-0.24753-0.056502-0.98582 6.908e-4 -1.3624 0.22535-1.4837 0.88842-2.961 1.7129-3.8163 0.34324-0.35606 0.65583-0.55847 0.95925-0.62114 1.1307-0.23355 2.715 2.1638 3.0111 4.5566 0.04807 0.38839 0.047374 0.86645-0.00168 1.153-0.20201 1.1802-1.1047 2.1107-2.2895 2.3599-0.22034 0.04635-0.6996 0.06382-0.91975 0.03353z"/>
         <path d="m8.2095 12.638v-2.1812h0.76308c0.41969 0 1.4929 0.0072 2.385 0.01592l1.6219 0.01592v4.3306h-4.77z"/>
         <path d="m9.1466 9.9305-0.58497-0.012628 1.7919-1.4502h4.1477l-1.4855 1.4861-1.6421-0.0053488c-0.90314-0.00294-1.9053-0.011032-2.227-0.017977z"/>
         <path d="m13.507 12.375v-2.1932l1.6707-1.6702 0.01538 0.1281c0.0085 0.070455 0.01548 1.0504 0.01559 2.1776l2.09e-4 2.0495-1.7018 1.7013z"/>
        </g>
       </g>
      </svg>
    </button>
    <ul className="dropdown-menu" aria-labelledby="ingDropdown">
      <li key="99999999999999"><a className="dropdown-item" style={{cursor: 'pointer'}}>Ajouter une liste...</a></li>
      {Object.values(gon.recipe.ingredients || {}).map(ing => {
        let text = Utils.prettyQuantityFor(ing.raw, ing.food.name)
        return <li key={ing.id}><a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => editor.chain().focus().insertIngredient(ing.item_nb).run()}>{text}<Inline color="#0d6efd">{ing.food.name}</Inline></a></li>
      })}
    </ul>
  </span>
)
const AddNoteButton = ({editor, width, height}) => (
  <button title="Rechercher et ajouter une note existante au texte sélectionné">
    <svg xmlns="http://www.w3.org/2000/svg" width={width-2} height={height-2} fill="currentColor" className="bi bi-journals" viewBox="0 0 16 16">
      <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
      <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
    </svg>
  </button>
)
const MeasuringButton = ({editor, width, height}) => (
  <button title="Ajouter un quantité">
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-cup" viewBox="0 0 16 16">
      <g>
       <ellipse cx="5.1163" cy="11.808" rx="3.7516" ry="1.7076" fill="#fff" stroke="#000003" strokeWidth=".81488"/>
      </g>
      <g>
       <rect x=".91891" y="7.2065" width="8.563" height="4.2563" fill="#fff" stroke="#fff" strokeWidth=".81616"/>
       <path d="m7.7711 6.993 1.0968 1.2182 6.3798-3.6834-1.1496-1.1496z" fill="none" stroke="#000" strokeWidth=".81488px"/>
      </g>
      <g strokeWidth=".81488">
       <ellipse cx="5.1191" cy="8.3462" rx="3.7516" ry="1.7076" fill="#fff" stroke="#000003"/>
       <path d="m1.3731 8.1993v3.7346" fill="none" stroke="#000"/>
       <path d="m8.8679 8.2112v3.7227" fill="none" stroke="#000"/>
      </g>
   </svg>
  </button>
)
const CharButton = ({editor, width, height}) => (
  <span className="dropdown">
    <button type="button" title="Ajouter un charactère" className="dropdown-toggle" id="charDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <svg className="bi bi-deg-c" width={width} height={height} fill="currentColor" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="5" r="1.5592" fill="#fff" stroke="#000003" strokeWidth=".7515"/>
        <text x="5" y="13" fill="#000000" fontFamily="sans-serif" fontSize="17px" letterSpacing="0px" wordSpacing="0px" style={{lineHeight:1.25}} xmlSpace="preserve"><tspan x="4.932128" y="13.764425">c</tspan></text>
      </svg>
    </button>
    <div className="dropdown-menu dropdown-grid" aria-labelledby="charDropdown">
      <a onClick={() => editor.chain().focus().insertContent("°C").run()}>°C</a>
      <a onClick={() => editor.chain().focus().insertContent("°F").run()}>°F</a>
    </div>
  </span>
)
const BoldButton = ({editor, width, height}) => (
  <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-bold" viewBox="0 0 16 16">
      <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
   </svg>
  </button>
)
const ItalicButton = ({editor, width, height}) => (
  <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-italic" viewBox="0 0 16 16">
      <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
    </svg>
  </button> 
)
const MoreButton = ({editor, width, height}) => (
  <span className="dropdown">
    <button type="button" title="Ajouter un lien" id="moreDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    </button> 
    <ul className="dropdown-menu" aria-labelledby="moreDropdown">
      <li key="2"><a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => editor.chain().focus().toggleStep().run()}>Ajouter une première étape</a></li>
    </ul>
  </span>
)
const StrikeButton = ({editor, width, height}) => (
  <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-strikethrough" viewBox="0 0 16 16">
      <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"/>
    </svg>
  </button>
)
const LinkButton = ({editor, width, height}) => (
  <span className="dropdown">
    <button type="button" title="Ajouter un lien" className="dropdown-toggle" id="linkDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
      </svg>
    </button> 
    <ul className="dropdown-menu" aria-labelledby="linkDropdown">
      {!gon.recipe ? null : <li key="1">
        <a className="dropdown-item" style={{cursor: 'pointer'}}>Note &raquo;</a>
        <ul className="dropdown-menu dropdown-submenu">
          {Object.values(gon.recipe.notes || {}).map(note => (
            <li key={note.id}>
              <a className="dropdown-item" onClick={() => editor.chain().focus().insertLink(`note:${note.item_nb}`).run()}>[{note.item_nb}] {Utils.stringSnippet(Utils.stripHtml(note.content))}</a>

            </li>
          ))}
        </ul>
      </li>}
      <li key="2"><a className="dropdown-item" style={{cursor: 'pointer'}} onClick={(evt) => alert('todo')}>Référence</a></li>
    </ul>
  </span>
)
const SubscriptButton = ({editor, width, height}) => (
  <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={editor.isActive('subscript') ? 'is-active' : ''}>
    <svg width={width} height={height} viewBox="0 0 18 18">
      <path className="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/>
      <path className="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/>
    </svg>
  </button> 
)
const SuperscriptButton = ({editor, width, height}) => (
  <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={editor.isActive('superscript') ? 'is-active' : ''}>
    <svg width={width} height={height} viewBox="0 0 18 18">
      <path className="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/>
      <path className="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/>
    </svg>
  </button>
)

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
    let comment = null
    if (ingredient.startsWith("(")) {
      const raw = ingredient.slice(1,-1)
      const [qty, foodName] = Quantity.parseQuantityAndFoodName(raw)
      text = Utils.prettyQuantityFor(qty.raw, foodName)
      food = gon.foodList.find(food => food.name == foodName)
    } else {
      const ing = Object.values(gon.recipe.ingredients || {}).find(ing => ing.item_nb == ingredient)
      if (ing) {
        text = Utils.prettyQuantityFor(ing.raw, ing.food.name)
        food = ing.food
        comment = ing.comment
      }
    }
    let children = []
    if (text && text != '') {children.push(text)}
    if (food) { children.push(['a', {href: food.url}, food.name]) }
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
          let text = Utils.prettyQuantityFor(ing.raw, ing.food.name)
          if (text && text != '') {children.push(text)}
          children.push(['a', {href: ing.food.url}, ing.food.name])
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
      History, IngredientNode, IngredientListNode, StepNode,// Subscript, Superscript,
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
