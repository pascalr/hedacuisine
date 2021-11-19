import React, { useState, useEffect, useRef } from 'react'

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
import { Node as ProseMirrorNode } from 'prosemirror-model'

// MINE
import Quantity from 'models/quantity'
import { Ingredient, Utils } from "recipe_utils"

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
const StrikeButton = ({editor, width, height}) => (
  <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-strikethrough" viewBox="0 0 16 16">
      <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"/>
    </svg>
  </button>
)
const LinkButton = ({editor, width, height}) => (
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
    </svg>
  </button> 
)

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
    if (ingredient.startsWith("(")) {
      const raw = ingredient.slice(1,-1)
      const [qty, foodName] = Quantity.parseQuantityAndFoodName(raw)
      let children = []
      let text = Utils.prettyQuantityFor(qty.raw, foodName)
      if (text && text != '') {children.push(text)}
      const food = gon.foodList.find(food => food.name == foodName)
      if (food) {
        // TODO: Find food id
        //children.push([
        //  'a', {href: ing.food.url}, ing.food.name,
        //])//`<a href="${ing.food.url}">${ing.food.name}</a>`)
      }
      return ['span', HTMLAttributes, ...children]
      return ['span', HTMLAttributes, "INVALID INGREDIENT"]
    } else {
      const ing = Object.values(gon.recipe.ingredients).find(ing => ing.item_nb == ingredient)
      let children = []
      if (ing) {
        let text = Utils.prettyQuantityFor(ing.raw, ing.food.name)
        if (text && text != '') {children.push(text)}
        children.push([
          'a', {href: ing.food.url}, ing.food.name,
        ])//`<a href="${ing.food.url}">${ing.food.name}</a>`)
      }
      // Return: ['tagName', {attributeName: 'attributeValue'}, child1, child2, ...children]
      return ['span', HTMLAttributes, ...children]
    }
  },

  parseHTML() {
    return [{tag: 'span[data-ingredient]'}]
  },

  addCommands() {
    //.insertContent('Example Text')
    return {
      setIngredient: (ingId) => ({ commands }) => {
        console.log("setIngredient")
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
        const ing = Object.values(gon.recipe.ingredients).find(ing => ing.item_nb == ingredient)
        if (ing) {
          let children = []
          let text = Utils.prettyQuantityFor(ing.raw, ing.food.name)
          if (text && text != '') {children.push(text)}
          children.push(['a', {href: ing.food.url}, ing.food.name])
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

  //onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
  //      className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
  //    >
  // { 'is-active': editor.isActive('heading', { level: 1 }) }
  //
  //  onClick={() => editor.chain().focus().setParagraph().run()}
  //      className={editor.isActive('paragraph') ? 'is-active' : ''}

  // REALLY UGLY
  let selectedHeader = "0";
  if (editor.isActive('heading', { level: 3 })) {selectedHeader = "3"}
  if (editor.isActive('heading', { level: 4 })) {selectedHeader = "4"}
  if (editor.isActive('heading', { level: 5 })) {selectedHeader = "5"}
  // selectedHeader = editor.getAttributes('heading').level // Does not work

  return (
    <div className="toolbar" style={{display: "flex"}}>
      <Inline padding="0 1em">
        <select value={selectedHeader} onChange={(e) => {
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
      <Inline padding="0 1em">
        <button onClick={() => editor.chain().focus().toggleStep().run()} className={editor.isActive('step') ? 'is-active' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-hash" viewBox="0 0 16 16">
            <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
          </svg>
        </button> 
        <span className="dropdown">
          <button type="button" className="dropdown-toggle" id="ingDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-egg-fried" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
            </svg>
          </button>
          <ul className="dropdown-menu" aria-labelledby="ingDropdown">
            {Object.values(gon.recipe.ingredients).map(ing => {
              let text = Utils.prettyQuantityFor(ing.raw, ing.food.name)
              return <li key={ing.id}><a className="dropdown-item" style={{cursor: 'pointer'}} onClick={(evt) => editor.chain().focus().setIngredient(ing.item_nb).run()}>{text}<Inline color="#0d6efd">{ing.food.name}</Inline></a></li>
            })}
          </ul>
        </span>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-journals" viewBox="0 0 16 16">
            <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
            <path d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0z"/>
          </svg>
        </button> 
        <LinkButton editor={editor} width={width} height={height} />
      </Inline>
      <Inline padding="0 1em">
        <BoldButton editor={editor} width={width} height={height} />
        <ItalicButton editor={editor} width={width} height={height} />
        <StrikeButton editor={editor} width={width} height={height} />
        <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={editor.isActive('subscript') ? 'is-active' : ''}>
          <svg width={width} height={height} viewBox="0 0 18 18">
            <path className="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/>
            <path className="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/>
          </svg>
        </button> 
        <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={editor.isActive('superscript') ? 'is-active' : ''}>
          <svg width={width} height={height} viewBox="0 0 18 18">
            <path className="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/>
            <path className="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/>
          </svg>
        </button> 
      </Inline>
      <Inline padding="0 1em">
        <button onClick={() => {let html = editor.getHTML(); console.log(html); alert(html)}}>
          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
          </svg>
        </button> 
      </Inline>
      <Inline flexGrow="1"></Inline>
      <button style={{padding: "0 1em"}}>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="#0d6efd" className="bi bi-question-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
        </svg>
      </button> 
    </div>
  )
  //<button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
  //  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-type-underline" viewBox="0 0 16 16">
  //    <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
  //  </svg>
  //</button> 
  //<button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
  //  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-list-ul" viewBox="0 0 16 16">
  //    <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  //  </svg>
  //</button> 
//        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
//          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-list-ol" viewBox="0 0 16 16">
//            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
//            <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
//          </svg>
//        </button> 
//        <button onClick={(evt) => editor.chain().focus().setIngredientList([]).run()}>
//          <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" className="bi bi-list-check" viewBox="0 0 16 16">
//            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
//          </svg>
//        </button> 
}

export const registerEditor = (editor, field) => {
}

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [Bold, Italic, Document, Paragraph, Strike, Text, CustomHeading,
      History, IngredientNode, IngredientListNode, StepNode, Subscript, Superscript
    ],
    content: gon.recipe.text,
  })

  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // Use registerEditor
  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // FIXME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  var savedHTML = gon.recipe.text
  setInterval(function() {
    if (!editor) {return}
    let current = editor.getHTML()
    if (current != savedHTML) {
      console.log('Saving changes');

      let data = new FormData()
      data.append('recipe[text]', current)
      Rails.ajax({url: gon.recipe.url, type: 'PATCH', data: data, success: () => {
        savedHTML = current
      }})
    }
  }, 5*1000);
 
  // FIXME: This does not work with multiple editors...
  // Check for unsaved data
  window.onbeforeunload = function() {
    if (editor && editor.getHTML() != savedHTML) {
      return 'There are unsaved changes. Are you sure you want to leave?';
    }
  }

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export const BubbleTiptap = ({content}) => {

  const width = 24
  const height = 24

  const editor = useEditor({
    extensions: [Bold, Italic, Strike, Document, History, Text, Paragraph, Link],
    content: content,
  })

  return (
    <>
      {editor && <BubbleMenu editor={editor}>
        <BoldButton editor={editor} width={width} height={height} />
        <ItalicButton editor={editor} width={width} height={height} />
        <StrikeButton editor={editor} width={width} height={height} />
        <LinkButton editor={editor} width={width} height={height} />
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </>
  )
}
