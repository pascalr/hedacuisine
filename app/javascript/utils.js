export function colorToHexString(color) {
  return '#' + Number(color).toString(16)
}

export function hexStringToColor(hex) {
  return parseInt(hex.slice(1), 16)
}

export function addExtensionToPath(ext, path) {
  if (path == null) {return null}
  // TODO: Add dot if ext does not start with a dot
  let i = path.indexOf('?')
  if (i == -1) {
    return ext + path
  } else {
    return path.substr(0, i)+ext+'?'+path.substr(i+1)
  }
}

// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
export function normalizeSearchText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

const Utils = {}
Utils.addExtensionToPath = addExtensionToPath
Utils.colorToHexString = colorToHexString
Utils.hexStringToColor = hexStringToColor
Utils.normalizeSearchText = normalizeSearchText
export { Utils }
