import Quantity from './models/quantity'
import { Utils } from "./recipe_utils"

// An ingredient has a quantity and a food.
// The quantity is a number with an optional label (unit in this case).
// The food can be only a foodName, or it can be a real food from the database.
//
// This seems to be a helper class to make things cleaner. The core of the job is done by models/quantity and recipe_utils
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
      this.rawQty = qty.raw
      this.rawFood = rawFood
    } else {
      this.rawQty = args.rawQty
      this.rawFood = args.rawFood
    }

    this.foodName = this.rawFood // TODO: Parse the rawFood to extract only the food. Oeufs battus => oeufs
  }

  getQuantity() {
    this.qty ||= new Quantity({raw: this.rawQty})
    return this.qty
  }

  getFood() {
    if (!gon.foodList || !this.foodName) {return null}
    return gon.foodList.find(food => food.name == this.foodName)
  }
  getNb() {
    getQuantity().nb
    if (!gon.foodList || !this.foodName) {return null}
    return gon.foodList.find(food => food.name == this.foodName)
  }

  pretty() {
    return prettyQty() + ' ' + prettyFoodHTML()
  }
  prettyQty() {
    let quantity = this.getQuantity()
    return Utils.prettyQuantityFor(quantity, this.foodName)
  }
  prettyFoodHTML() {
  }
}
