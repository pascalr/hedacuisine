export function isBlank(array) {
  return !array || array.length == 0
}

export function colorToHexString(color) {
  return '#' + Number(color).toString(16)
}

export function hexStringToColor(hex) {
  return parseInt(hex.slice(1), 16)
}

export function sortBy(list, attr) {
  return list.sort((a,b) => a[attr] - b[attr])

}

export function addExtensionToPath(ext, path) {
  if (path == null) {return null}
  ext = ext[0] == "." ? ext : "."+ext
  let i = path.indexOf('?')
  if (i == -1) {
    return path + ext
  } else {
    return path.substr(0, i)+ext+'?'+path.substr(i+1)
  }
}

// Unfortunately, FormData only handles strings.
// FormData sends null as "null", but we want ""
// FormData sends true as "true", but we want "1"
// FormData sends false as "false", but we want "0"
function convertFormDataValue(val) {
  if (val === null || val === "null") {return ''}
  if (val === false || val === "false") {return '0'}
  if (val === true || val === "true") {return '1'}
  return val
}

/**
 * Parameters
 * url
 * contentType: default is "application/json"
 * type: "GET", "PATCH" or "POST"
 * data: the data to send either as an object or a FormData
 * sucess: success callback function
 * error: error callback function
**/
export function ajax(params) {

  // I think using FormData is better in order to be able to send files.
  if (params.data instanceof FormData) {

    let c = new FormData()
    for (let [k, v] of params.data) {
      let v1 = convertFormDataValue(v)
      c.append(k, convertFormDataValue(v))
    }
    params.data = c

    params.url = addExtensionToPath("json", params.url)
    Rails.ajax(params)

  } else {

    let data = {
      authenticity_token: $('[name="csrf-token"]')[0].content,
      ...params.data
    }
    $.ajax({
      type: params.type,
      url: addExtensionToPath("json", params.url),
      data: data,
      //contentType: "application/json",
      //data: JSON.stringify(data),
      success: params.success,
      error: params.error,
    });

  }
}

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
export function normalizeSearchText(text) {
  if (text == null) {return null}
  if (text == '') {return ''}
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

export function toBoolean(a) {
  return String(a).toLowerCase() == "true"
}

const Utils = {}
Utils.addExtensionToPath = addExtensionToPath
Utils.colorToHexString = colorToHexString
Utils.hexStringToColor = hexStringToColor
Utils.normalizeSearchText = normalizeSearchText
Utils.toBoolean = toBoolean
Utils.ajax = ajax
export { Utils }
