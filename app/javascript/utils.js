// https://gist.github.com/A1rPun/b650b819f70942feb324/
/**
 * Converts a BGR base10 color to an RGB Hex value.
 *
 * @method colorToHexString
 * @param {Integer} dColor A color as integer.
 * @returns {String} The RGB hex code as string.
 */
export function colorToHexString(dColor) {
    return '#' + ("000000" + (((dColor & 0xFF) << 16) + (dColor & 0xFF00) + ((dColor >> 16) & 0xFF)).toString(16)).slice(-6);
}

// https://gist.github.com/A1rPun/b650b819f70942feb324/
/**
 * Converts RGB Hex string to a BGR base10 color.
 *
 * @method hexStringToColor
 * @param {String} hex A hex code as string.
 * @returns {Integer} The integer in base10 format.
 */
export function hexStringToColor(hex) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return (r | g << 8 | b << 16);
}

export function addExtensionToPath(ext, path) {
  // TODO: Add dot if ext does not start with a dot
  let i = path.indexOf('?')
  if (i == -1) {
    return ext + path
  } else {
    return path.substr(0, i)+ext+'?'+path.substr(i+1)
  }
}

const Utils = {}
Utils.addExtensionToPath = addExtensionToPath
Utils.colorToHexString = colorToHexString
Utils.hexStringToColor = hexStringToColor
export { Utils }
