export default class Servings {
  constructor(raw) {
    if (raw.includes(';')) {
      let s = raw.split(';',1)
      this.qty = s[0]
      this.label = s[1]
    }
  }
  
  scale(factor) {
  }
}
