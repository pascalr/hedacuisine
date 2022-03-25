import {prettyNumber, extractNumberAtBeginning} from "./utils"

export default class Servings {
  constructor(raw) {
    //if (raw.includes(';')) {
    //  let s = raw.split(';',1)
    //  this.qty = s[0]
    //  this.label = s[1]
    //}
    let rangeSeparator = [',', 'à', 'to']
    console.log('here')
    this.qty0 = extractNumberAtBeginning(raw)
    console.log('qty0', this.qty0)
    let rest = raw.slice(this.qty0.length).trim()
    let that = this
    console.log('rest', rest);
    (function() {
      rangeSeparator.forEach(separator => {
        if (rest.startsWith(separator)) {
          that.separator = separator
          rest = rest.slice(that.separator.length).trim()
          console.log('rest', rest);
          that.qty1 = extractNumberAtBeginning(rest)
          console.log('qty1', that.qty1);
          console.log('qty1.length', that.qty1.length);
          that.label = rest.slice(that.qty1.length).trim()
          return
        }
      })
    })()
    if (!this.label) {this.label = rest}
    console.log('label', this.label);
  }
  
  scale(factor) {
    this.scaleFactor = factor
    return this
  }

  print() {
    let qty0 = prettyNumber(this.qty0*this.scaleFactor)
    let qty1 = prettyNumber((this.qty1||0)*this.scaleFactor)
    return `${this.separator ? `${qty0} ${this.separator} ${qty1}` : qty0} ${this.label}`
  }
}

//function scaleRaw(raw) {
//  if (!raw) {return ""}
//  var quantity = new Quantity({raw: raw})
//  var v = Utils.prettyFraction(quantity.nb*window.scale)
//  if (quantity.label) {return v + " " + quantity.label}
//  return v
//}
