import React, { useState, useEffect, useRef } from 'react'

import { colorToHexString, hexStringToColor, Utils } from 'utils'

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
      console.log(`Updating model ${field} from ${model[field]} to ${value}.`)
      model[field] = value
      if (successCallback) {successCallback()}
      if (model.onUpdate) {model.onUpdate(model)}
    }, error: (errors) => {
      toastr.error("<ul>"+Object.values(JSON.parse(errors)).map(e => ("<li>"+e+"</li>"))+"</ul>", 'Error updating')
    }})
  }
}
export const ImageField = ({model, imageAttr, field, ...props}) => {

  const [value, setValue] = useState(model[field])
  const handleOpen = () => {
  
    const form = document.querySelector("#new-image-modal-form");
    form.onImageCreate = (image) => {
      console.log('form.onImageCreate!!', image)
      model[image_attr] = image
      updateModelField(model, field, image.id)
    }
  }

  if (!model[field]) {
    return (<>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-image-modal" onClick={handleOpen}>
        Ajouter une image
      </button>
    </>)
  } else if (model[imageAttr]) {
    return <span>{model[imageAttr].filename} <a onClick={() => {}}>x</a></span>
  }
  throw "ImageField missing imageAttr"
}
export const ToggleField = ({model, field, labelOn, labelOff, ...props}) => {
  console.log('rendering')
  const id = model.class_name+"_"+field
  const name = model.class_name+"["+field+"]"
  const on = labelOn || "True"
  const off = labelOff || "False"
  return (<>
    <label htmlFor={id}>{model[field] ? on : off}</label> 
    <input type="checkbox" value={model[field]||''} name={name} id={id} {...props}
      onChange={(e) => {updateModelField(model, field, e.target.checked)}} hidden />
  </>)
}
export const TextField = ({model, field, ...props}) => {
  const [value, setValue] = useState(model[field])
  return (
    <input type="text" value={value||''} name={model.class_name+"["+field+"]"} id={field} {...props}
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => {updateModelField(model, field, value)}} />
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
  //let value = Utils.colorToHexString(model[field])
  const [value, setValue] = useState(Utils.colorToHexString(model[field]))
        //onChange={(e) => {let v = e.target.value; console.log(v); updateModelField(model, field, Utils.hexStringToColor(v), () => setValue(v))}} />
        //onChange={(e) => {updateModelField(model, field, Utils.hexStringToColor(e.target.value))}} />
  return (
    <input type="color" value={value||''} name={model.class_name+"["+field+"]"} id={field}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {updateModelField(model, field, Utils.hexStringToColor(value))}} />
  )
}
/**
 * Generates a select tag with the given options.
 * @param {Object} model - The model to modify
 * @param {String} field - The name of the field containing the id to be selected
 * @param {Array} options - An array of values for setting the field
 * @param {Array} showOption - A function to show the option. (option) => howToPrint(option)
 * @param {Boolean} includeBlank - Whether to include blank or not
 */
// Example: <CollectionSelect model={recipe} field="recipe_kind_id" options={gon.recipe_kinds.map(k => k.id)} showOption={(id) => gon.recipe_kinds.find(k => k.id == id).name} includeBlank="true">
export const CollectionSelect = ({model, field, options, showOption, includeBlank}) => {
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
