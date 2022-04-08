import React, { useState, useEffect, useRef } from 'react'

import { normalizeSearchText, colorToHexString, hexStringToColor, Utils, ajax } from './utils'

import { DeleteConfirmButton } from './components/delete_confirm_button'

import autocomplete from 'js-autocomplete';

export const TextInputField = ({model, field}) => {
  const [value, setValue] = useState(model.currentValue(field))

  return (
    <input type="text" value={value||''} name={model.fieldName(field)}
      id={field} onChange={(e) => setValue(e.target.value)}
      onBlur={() => model.updateValue(field, value)} />
  )
}

export const AutocompleteInput = ({name, choices, placeholder, onSelect}) => {
  const inputRef = useRef(null);
  useEffect(() => { // Same as componentDidMount
    
    if (inputRef.current) {
      console.log('new autocomplete')
      let my_autocomplete = new autocomplete({
        selector: inputRef.current,
        minChars: 1,
        source: function(term, suggest){
          term = normalizeSearchText(term)
          const matches = [];
          for (const idx in choices) {
            let item = choices[idx]
            if (item.name && ~normalizeSearchText(item.name).indexOf(term)) {
              matches.push(idx);
            }
          }
          suggest(matches);
        },
        renderItem: function (idx, search){
          let item = choices[idx]
          search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          let r = '<a class="autocomplete-suggestion id="'+idx+'" data-id="'+item.id+'" href="'+item.url+'">'
          if (item.image) {r += '<img src="'+item.image+'"></img>'}
          r += item.name.replace(re, "<b>$1</b>") + '</a>';
          return r
        },
        onSelect: onSelect,
      })
      return () => {
        my_autocomplete.destroy()
      }
    }
  }, [])
  return <>
    <input type="search" name={name} id={name} placeholder={placeholder} aria-label="Search" autoComplete="off" ref={inputRef} />
  </>
}

// onUpdate is a callback to set the state
// onServerUpdate is a callback to handle the data returned by the controllers update method

export const clearRecord = (record) => {
  return {id: record.id, class_name: record.class_name, onUpdate: record.onUpdate, onServerUpdate: record.onServerUpdate}
}
export const updateRecord = (oldRecord, newRecord, nested={}) => {
  let obj = {...oldRecord, ...newRecord}
  for (const key in nested) {
    obj[key] = {...oldRecord[key], ...newRecord[key], ...nested[key]}
    //obj[key] = updateRecord(obj[key], nested[key])
  }
  return obj
}

// FIXME: There can be a race condition between onUpdate and onServerUpdate... I don't know how to handle this properly...
// I need onServerUpdate to get the modifications from the server.
// Why not always onServerUpdate again???
//this.state.recipe_kind.onUpdate = (recipe_kind) => {this.setState({recipe_kind})}
export const asyncUpdateModel = (model, diffs, options={}) => {

  if (!model.onUpdate && !model.onServerUpdate) {
    throw("asyncUpdateModelField requires the model ("+model.class_name+") to handle onUpdate or onServerUpdate")
  }
  let data = new FormData()
  for(let field in diffs) {
    model[field] = diffs[field]
    data.append(model.class_name+"["+field+"]", diffs[field] == null ? '' : diffs[field])
  }
  if (model.onUpdate) { model.onUpdate(model) }
  console.log('PATCH', model.url)
  ajax({url: model.url, type: 'PATCH', data: data, success: (response) => {
    console.log('PATCH received', response)
    if (model.onServerUpdate) { model.onServerUpdate(response) }
  }})
}
export const asyncUpdateModelField = (model, field, value, options={}) => {
  asyncUpdateModel(model, {[field]: value}, options)
}

const updateModelField = (model, field, value, successCallback=null) => {
  if (value != model[field]) {

    let data = new FormData()
    data.append(model.class_name+"["+field+"]", value)
    console.log('PATCH', model.url)
    ajax({url: model.url, type: 'PATCH', data: data, success: () => {
      console.log(`Updating model ${model.class_name} field ${field} from ${model[field]} to ${value}.`)
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
      model[imageAttr] = image
      updateModelField(model, field, image.id)
    }
  }

  const removeImage = (evt) => {
    model[imageAttr] = null
    updateModelField(model, field, null)
  }

  if (!model[field]) {
    return (<>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-image-modal" onClick={handleOpen}>
        Ajouter une image
      </button>
    </>)
  } else if (model[imageAttr]) {
    return (
      <span>
        {model[imageAttr].filename}
        <DeleteConfirmButton id={`del-im-${model[imageAttr].id}`} onDeleteConfirm={removeImage} message="Je veux enlever cette image?" />
      </span>
    )
  }
  throw "ImageField missing imageAttr"
}
export const FileField = ({model, field, maxSizeBytes, onRemove, ...props}) => {
  let id = `${model.class_name}_${field}`
  const handleChange = (e) => {
    if (e.target.files.length > 1) {
      alert('Error. You can only upload one file.');
      return;
    }
    var file = e.target.files[0];
    if (maxSizeBytes && file.size > maxSizeBytes) {
      alert(`Error. Max upload size is ${maxSizeBytes/1000.0}kb. Was ${file.size/1000.0}kb.`);
      return;
    }
    asyncUpdateModelField(model, field, file)
  }
  if (!model.filename) {
    return (<>
      <input type="file" name={`${model.class_name}[${field}]`} id={id} {...props} onChange={handleChange} />
    </>)
  } else {
    return (
      <span>
        {model.filename}
        <DeleteConfirmButton id={`del-im-${model.id}`} onDeleteConfirm={onRemove} message="Je veux enlever cette image?" />
      </span>
    )
  }
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

export const RadioField = ({model, field, value, label, ...props}) => {
  let id = `${model.class_name}_${field}_${value}`
  return (<>
    <input type="radio" value={value} name={model.class_name+"["+field+"]"}
      id={id} {...props} checked={model[field] == value}
      onChange={(e) => {asyncUpdateModelField(model, field, value)}}
    />
    {label ? <label htmlFor={id}>{' '}{label}</label> : ''}
          
  </>)
}
export const updateRecordField = (model, field, value, url, getter, setter) => {
  ajax({url: url, type: 'PATCH', data: {[model.class_name+"["+field+"]"]: value}, success: (record) => {
    let records = getter.map(r => {
      if (r.id == model.id) {
        r[field] = value
      }
      return r
    })
    setter(records)
  }})
}
export const TextField = ({model, field, inputRef, onUpdate, url, getter, setter, ...props}) => {
  const [value, setValue] = useState(model[field])

  if (url && getter && setter) {
    onUpdate = (model, field, value) => updateRecordField(model, field, value, url, getter, setter)
  }

  return (
    <input type="text" value={value||''} name={model.class_name+"["+field+"]"} id={field} ref={inputRef} {...props}
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => {onUpdate ? onUpdate(model, field, value) : updateModelField(model, field, value)}} />
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
