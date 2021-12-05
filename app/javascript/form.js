import React, { useState, useEffect, useRef } from 'react'

export class Model {
  constructor(name, data) {
    this.name = name
    this.data = (data == null) ? {} : data
  }
  currentValue(field) {
    return this.data[field]
  }
  fieldName(field) {
    return this.name+"["+field+"]"
  }
  updateValue = (field, value, successCallback=null) => {
    if (value != this.currentValue(field)) {
  
      let data = new FormData()
      data.append(this.fieldName(field), value)
      Rails.ajax({url: this.data.url+".js", type: 'PATCH', data: data, success: () => {
        this.data[field] = value
        if (successCallback) {successCallback()}
      }, error: (errors) => {
        toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
      }})
    }
  }
}
export const MODEL_RECIPE = new Model("recipe", gon.recipe)
export const MODEL_BOOK_RECIPE = new Model("book_recipe", gon.book_recipe)

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
