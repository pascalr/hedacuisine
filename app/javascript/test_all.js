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

function header(msg) {
  console.log('\x1b[0;94m%s\x1b[0m', msg);
}

function assertEquals(expected, current) {
  let msg = "Expected: "+expected+". Got "+current
  if (expected == current) {
    // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color#41407246
    console.log('\x1b[0;92m%s\x1b[0m - %s', 'PASS', msg);
  } else {
    console.log('\x1b[0;91m%s\x1b[0m - %s', 'FAIL', msg);
  }
}

header('Testing isBlank')
assertEquals(true, isBlank([]))
assertEquals(true, isBlank(""))
assertEquals(true, isBlank(null))
assertEquals(true, isBlank(undefined))
assertEquals(false, isBlank([1]))
assertEquals(false, isBlank("1"))



function testPrintRecipeIngredient() {
  header('Testing testPrintRecipeIngredient')

  //prettyQuantityFor('1/4 t', 'huile végétale')
  assertEquals("1/4 t d'", Utils.prettyQuantityFor('1/4 t', 'huile végétale'))
  assertEquals("250 mL d'", Utils.prettyQuantityFor('250 mL', 'huile végétale'))
  assertEquals('2', Utils.prettyQuantityFor('2', 'banane'))

  //test("2", "banane plantain", "2 bananes plantains")
  //test("1/2 t", "huile végétale", "1/2 t d'huile végétale")

  //const [qty, foodName] = Quantity.parseQuantityAndFoodName(ingredient)
  //text = Utils.prettyQuantityFor(qty.raw, foodName)
  //food = gon.foodList.find(food => food.name == foodName)
  //name = foodName
}

testPrintRecipeIngredient()
