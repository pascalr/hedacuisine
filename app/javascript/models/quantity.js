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
      if (s != null) {
        let qty_s = s[0]
        this.label = this.raw.substr(qty_s.length).trim()
        this.nb = Quantity.parseFloatOrFraction(qty_s)
        this.unit = gon.units.find(unit => unit.name == this.label)
      }
    }
  }

  // TODO: Try to parse complete ingredient separated by de or d'
  // Then, try to parse quantity. Check if label is a unit. Check if label is a food.
  static parseQuantityAndFoodName(raw) {
    const separators = ["de", "d'"]
    for (let i = 0; i < separators.length; i++) {
      if (raw.includes(separators[i])) {
        const s = raw.split(separators[i])
        let rawQty = s[0].trim()
        let foodName = s[1].trim()
        let qty = new Quantity({raw: rawQty})
        return [qty, foodName]
      }
    }
    let qty = new Quantity({raw: raw})
    if (qty.unit) {return [qty, null] }
    let foodName = qty.label
    qty.label = null
    return [qty, foodName]
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
