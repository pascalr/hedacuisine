import Quantity from './models/quantity'
import { Utils } from "./recipe_utils"

// An ingredient has a quantity and a food.
export default class Ingredient {

  // raw: 1 c. à thé; sucre ou 100 mL d'eau distillée
  // rawQty: 1 c. à thé ou 100 mL
  // rawFood: sucre ou eau distillée
  // record: An Ingredient from rails
  constructor(args = {}) {
    if (args.record) {
      this.rawQty = args.record.raw
      this.rawFood = args.record.raw_food
    } else if (args.raw) {
      const [qty, rawFood] = Quantity.parseQuantityAndFoodName(args.raw)
      this.rawQty = qty
      this.rawFood = rawFood
    } else {
      this.rawQty = args.rawQty
      this.rawFood = args.rawFood
    }

    this.foodName = this.rawFood // TODO: Parse the rawFood to extract only the food. Oeufs battus => oeufs
  }

  getQuantity() {
    if (this.qty) {return this.qty}
    this.qty = new Quantity({raw: this.rawQty})
    return this.qty
  }

  getFood() {
    if (!gon.foodList || !this.foodName) {return null}
    return gon.foodList.find(food => food.name == this.foodName)
  }

  pretty() {
    return prettyQty() + ' ' + prettyFoodHTML()
  }
  prettyQty() {
    let quantity = this.getQuantity()
    let unit = quantity.unit
    let qty = quantity.nb
    if (unit) {qty *= unit.value}
  
    let r = null 
    if (unit && unit.is_weight) {
      r = Utils.prettyWeight(qty) + ' ' + Utils.prettyPreposition(this.foodName)
    } else if (unit && unit.is_volume) {
      r = Utils.prettyVolume(qty) + ' ' + Utils.prettyPreposition(this.foodName)
    } else if (unit && unit.is_unitary) {
      r = Utils.prettyFraction(qty) + " " + unit.name
    } else {
      r = this.rawQty + ' ' + Utils.prettyPreposition(this.foodName)
    }
    return r

  }
  prettyFoodHTML() {
  }
}
