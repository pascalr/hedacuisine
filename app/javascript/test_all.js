import {foo} from './nodejs_dependencies'

import {isBlank} from './utils'
import Quantity from './models/quantity'
import { Utils } from "./recipe_utils"
import Ingredient from "./ingredient"

//# Ansi color code variables
//red="\e[0;91m"
//blue="\e[0;94m"
//expand_bg="\e[K"
//blue_bg="\e[0;104m${expand_bg}"
//red_bg="\e[0;101m${expand_bg}"
//green_bg="\e[0;102m${expand_bg}"
//green="\e[0;92m"
//white="\e[0;97m"
//bold="\e[1m"
//uline="\e[4m"
//reset="\e[0m"

function assertEquals(expected, current) {
  let msg = "Expected: "+expected+". Got "+current
  if (expected == current) {
    // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color#41407246
    console.log('\x1b[0;92m%s\x1b[0m - %s', 'PASS', msg);
  } else {
    console.log('\x1b[0;92m%s\x1b[0m - %s', 'FAIL', msg);
  }
}

assertEquals(true, isBlank([]))
assertEquals(true, isBlank(""))
assertEquals(true, isBlank(null))
assertEquals(true, isBlank(undefined))
assertEquals(false, isBlank([1]))
assertEquals(false, isBlank("1"))



function testParseQuantity() {
  //const [qty, foodName] = Quantity.parseQuantityAndFoodName(ingredient)
  //text = Utils.prettyQuantityFor(qty.raw, foodName)
  //food = gon.foodList.find(food => food.name == foodName)
  //name = foodName
}

//// ingredient can be a number, which is the item nb, or it can be a raw ingredient (quantity separated by food by a semicolon)
//const parseIngredient = (ingredient) => {
//  let text = null
//  let food = null
//  let name = null
//  let comment = null
//  let ing = null
//  if (ingredient.includes(";")) {
//    const [qty, foodName] = Quantity.parseQuantityAndFoodName(ingredient)
//    text = Utils.prettyQuantityFor(qty.raw, foodName)
//    food = gon.foodList.find(food => food.name == foodName)
//    name = foodName
//  } else if (ingredient.startsWith("(")) { // old version
//    const raw = ingredient.slice(1,-1)
//    const [qty, foodName] = Quantity.parseQuantityAndFoodName(raw)
//    text = Utils.prettyQuantityFor(qty.raw, foodName)
//    food = gon.foodList.find(food => food.name == foodName)
//    name = foodName
//  } else {
//    ing = Object.values(gon.recipe.ingredients || {}).find(ing => ing.item_nb == ingredient)
//    if (ing) {
//      let ingredient = new Ingredient({record: ing})
//      text = ingredient.prettyQty() + " "
//      food = ingredient.food
//      comment = ing.comment
//      name = ing.name
//    }
//  }
//  return ({text, food, name, comment, ing})
//}
