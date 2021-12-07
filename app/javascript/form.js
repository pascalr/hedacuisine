import React, { useState, useEffect, useRef } from 'react'

import { PATHS } from 'paths'

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
