export default class Quantity {

  constructor(args = {}) {
    this.raw = args.raw
    this.nb = null
    this.label = null

    this.ml = null
    this.grams = null
    this.total = null

    this.unit = null

    if (this.raw != null) {
      let s = this.raw.match(/^\d+( \d)?([,.\/]\d+)?/g)
      let qty_s = s[0]
      this.label = this.raw.substr(qty_s.length).trim()
      this.nb = Quantity.parseFloatOrFraction(qty_s)
      this.unit = gon.units.find(unit => unit.name == this.label)
    }
  }

  static parseFractionFloat(str) {
    var split = str.split('/')
    return split[0]/split[1]
  }

  static parseFloatOrFraction(str) {

    if (!str) {return null;}
    var qty_s = str.trim()
    if (qty_s.includes("/")) {
      if (qty_s.includes(" ")) {
        var s = qty_s.split(' ')
        var whole = s[0]
        var fraction = s[1]
        return parseInt(whole, 10) + Quantity.parseFractionFloat(fraction)
      } else {
        return Quantity.parseFractionFloat(qty_s)
      }
    } else {
      return parseFloat(qty_s)
    }
  }

  pretty() {
    if (!this.label) {
      return this.nb.toString()
    } else {
      return this.raw
    }
  }
}
