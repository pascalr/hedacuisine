import React, { useState, useEffect, useRef } from 'react'

import { PATHS } from 'paths'

import { colorToHexString, hexStringToColor, Utils } from 'utils'

export class Model {
  constructor(name, data) {
    this.name = name
    this.data = data
  }
  currentValue(field) {
    if (this.data == null) {return null}
    return this.data[field]
  }
  fieldName(field) {
    return this.name+"["+field+"]"
  }
  updateValue = (field, value, successCallback=null) => {
    if (value != this.currentValue(field)) {

      //if (this.data == null) {
      //  let data = new FormData()
      //  data.append(this.fieldName(field), value)
      //  let url = PATHS[`new_${this.name}`]
      //  Rails.ajax({url: url+".js", type: 'POST', data: data, success: () => {
      //    this.data = {}
      //    this.data[field] = value
      //    if (successCallback) {successCallback()}
      //  }, error: (errors) => {
      //    toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      //  }})
      //} else {
        let data = new FormData()
        data.append(this.fieldName(field), value)
        Rails.ajax({url: this.data.url+".js", type: 'PATCH', data: data, success: () => {
          this.data[field] = value
          if (successCallback) {successCallback()}
        }, error: (errors) => {
          toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
        }})
      //}
    }
  }
}
export const MODEL_THEME = new Model("theme", gon.theme)
export const MODEL_RECIPE = new Model("recipe", gon.recipe)
export const MODEL_BOOK_RECIPE = new Model("book_recipe", gon.book_recipe)

export const TextFieldTag = (props) => {
  const [value, setValue] = useState('')
  return <input type="text" value={value} name={props.name} onChange={(e) => setValue(e.target.value)} {...props} />
}

export const HiddenFieldTag = (props) => {
  return <input type="hidden" value={props.value} name={props.name} {...props} />
}

export const SubmitTag = (props) => {
  return <input type="submit" value={props.value} name="commit" {...props} />
}

export const TextInputField = ({model, field}) => {
  const [value, setValue] = useState(model.currentValue(field))

  return (
    <input type="text" value={value||''} name={model.fieldName(field)}
      id={field} onChange={(e) => setValue(e.target.value)}
      onBlur={() => model.updateValue(field, value)} />
  )
}

const updateModelField = (model, field, value, successCallback=null) => {
  if (value != model[field]) {

    let data = new FormData()
    data.append(model.class_name+"["+field+"]", value)
    Rails.ajax({url: model.url, type: 'PATCH', data: data, success: () => {
      console.log("updateModelField success", field, value)
      model[field] = value
      if (successCallback) {successCallback()}
      if (model.onUpdate) {model.onUpdate(model)}
    }, error: (errors) => {
      toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
    }})
  }
}
export const TextField = ({model, field}) => {
  const [value, setValue] = useState(model[field])
  return (
    <input type="text" value={value||''} name={model.class_name+"["+field+"]"} id={field}
        onChange={(e) => {let v = e.target.value; updateModelField(model, field, v, () => setValue(v))}} />
  )
}
export const EditableField = ({model, field}) => {
  return (
    <div contentEditable suppressContentEditableWarning={true} name={model.class_name+"["+field+"]"}
         id={field} onBlur={(e) => {updateModelField(model, field, e.target.innerText)}} >
      {model[field]||''} 
    </div>
  )
}
export const ColorField = ({model, field}) => {
  const [value, setValue] = useState(Utils.colorToHexString(model[field]))
  return (
    <input type="color" value={value||''} name={model.class_name+"["+field+"]"} id={field}
        onChange={(e) => {let v = e.target.value; updateModelField(model, field, Utils.hexStringToColor(v), () => setValue(v))}} />
  )
}
export const CollectionSelect2 = ({model, field, options, showOption, includeBlank}) => {
  const [value, setValue] = useState(model[field])

  const updateField = (e) => {
    let val = e.target.value
    updateModelField(model, field, val, () => setValue(val))
  }

  return (
    <select name={model.class_name+"["+field+"]"} id={field} value={value||''} onChange={updateField}>
      {includeBlank ? <option value="" key="1" label=" "></option> : null}
      {options.map((opt, i) => {
        return <option value={opt} key={i+2}>{showOption(opt)}</option>
      })}
    </select>
  )
}

export const TextAreaField = ({model, field, cols, rows, changeCallback=null}) => {
  const [value, setValue] = useState(model.currentValue(field))

  return (
    <div className="field">
      <textarea value={value||''} name={model.fieldName(field)} id={field} cols={cols} rows={rows} onChange={(e) => {
        setValue(e.target.value);
        if(changeCallback) {changeCallback(e.target.value)}
      }} onBlur={() => model.updateValue(field, value)} />
    </div>
  )
}

export const CollectionSelect = ({model, field, options, showOption, includeBlank}) => {
  const [value, setValue] = useState(model.currentValue(field))

  const updateField = (e) => {
    let val = e.target.value
    model.updateValue(field, val, () => setValue(val))
  }

  return (
    <select name={model.fieldName(field)} id={field} value={value||''} onChange={updateField}>
      {includeBlank ? <option value="" key="1" label=" "></option> : null}
      {options.map((opt, i) => {
        return <option value={opt} key={i+2}>{showOption(opt)}</option>
      })}
    </select>
  )
}

//export const remoteUpdate = (field, value, initialValue, url, successCallback=null) => {
//  if (value != initialValue) {
//
//    let data = new FormData()
//    data.append(field, value)
//    Rails.ajax({url: this.data.url+".js", type: 'PATCH', data: data, success: () => {
//      this.data[field] = value
//      if (successCallback) {successCallback()}
//    }, error: (errors) => {
//      toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
//    }})
//  }
//}
//
//export const ColorFieldTag = ({value, ...props}) => {
//
//  if (!props.name) {console.error("ColorFieldTag name props must be provided."); return null}
//
//  // FIXME: Convert value int to hex.
//  const [val, setVal] = useState(value ? value : '#000000')
//
//  const updateColor = () => {
//    let i = hexStringToColor(value)
//    remoteUpdate(props.name, i, value)
//  }
//
//  return <input type="color" value={val} name={name} onChange={(e) => setValue(e.target.value)} {...props} onBlur={updateColor} />
//}
