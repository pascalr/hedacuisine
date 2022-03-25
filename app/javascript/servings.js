import {prettyNumber, extractNumberAtBeginning} from "./utils"

// The purpose of this class is to handle ranges. 8 - 10 portions. 20 à 24 biscuits
export default class Servings {
  constructor(raw) {
    let rangeSeparator = [',', 'à', 'to']
    this.qty0 = extractNumberAtBeginning(raw)
    let rest = raw.slice(this.qty0.length).trim()
    let that = this; // semicolon is required here
    (function() {
      rangeSeparator.forEach(separator => {
        if (rest.startsWith(separator)) {
          that.separator = separator
          rest = rest.slice(that.separator.length).trim()
          that.qty1 = extractNumberAtBeginning(rest)
          that.label = rest.slice(that.qty1.length).trim()
          return
        }
      })
    })()
    if (!this.label) {this.label = rest}
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

  average() {
    return this.qty1 ? (this.qty1+this.qty0)/2.0 : this.qty0
  }
}
