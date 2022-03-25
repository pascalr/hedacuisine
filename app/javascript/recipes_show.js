// https://stackoverflow.com/questions/25888963/min-by-max-by-equivalent-functions-in-javascript

import {Utils} from "./recipe_utils"
import Quantity from './models/quantity'
import Servings from './servings'
import {addRecipeToBook} from './modals/add_recipe_to_book'

function prettyIngredientV2(ing) {

  var linkSingular = "<a href='/foods/"+ing.food_id+"'>"+ing.food_name+"</a> "

  if (ing.raw == null || ing.raw == "") {return linkSingular}

  var quantity = new Quantity({raw: ing.raw})
  let r = Utils.prettyQuantityFor(quantity, ing.food_name, window.scale)
  
  // FIXME: This should belongs to quantity. Should do quantity.scale(window.scale). Then get quantity.total
  var qty = quantity.nb * scale
  if (quantity.unit) {qty *= quantity.unit.value}

  if ((!quantity.unit || (!quantity.unit.is_volume && !quantity.unit.is_weight)) && qty > 1) {
    r += "<a href='/foods/"+ing.food_id+"'>"+ing.food_plural+"</a> "
  } else {
    r += linkSingular 
  }
  if (ing.comment) {
    r += " " + ing.comment + " "
  }
  return r
}

function prettyIngredient(ing) {

  var linkSingular = "<a href='/foods/"+ing.dataset.foodId+"'>"+ing.dataset.foodNameSingular+"</a> "

  if (ing.dataset.raw == null || ing.dataset.raw == "") {return linkSingular}

  var quantity = new Quantity({raw: ing.dataset.raw})
  var unit = quantity.unit
  var qty = quantity.nb * window.scale
  if (unit) {qty *= unit.value}

  if (unit && unit.is_weight) {
    var r = Utils.prettyWeight(qty) + " "
  } else if (unit && unit.is_volume) {
    var r = Utils.prettyVolume(qty) + " "
  } else {
    var r = Utils.prettyFraction(qty) + " "
    if (unit) {r += unit.name + " "}
  }
  if (unit && ing.dataset.preposition) {r += ing.dataset.preposition }
  if ((!unit || (!unit.is_volume && !unit.is_weight)) && qty > 1) {
    r += "<a href='/foods/"+ing.dataset.foodId+"'>"+ing.dataset.foodNamePlural+"</a> "
  } else {
    r += linkSingular 
  }
  if (ing.dataset.comment) {
    r += " " + ing.dataset.comment + " "
  }
  return r
}

function prettyDetailedIngredient(ing) {
  
  var r = prettyIngredient(ing)
  if (ing.dataset.raw == null || ing.dataset.raw == "") {return r}
  
  var quantity = new Quantity({raw: ing.dataset.raw})
  var unit = quantity.unit
  var grams = ing.dataset.grams * window.scale
  var ml = ing.dataset.ml * window.scale
  
  r += "<span class='ingredient-details'>("
  if (unit && unit.is_weight) {
    // TODO: Show unit quantity if food can be unit.
    r += `${Utils.prettyVolume(ml)} · ${Utils.prettyMetricVolume(ml)}`
  } else if (unit && unit.is_volume) {
    // TODO: Show unit quantity if food can be unit.
    // FIXME: What if it is already metric???
    r += `${Utils.prettyMetricVolume(ml)} · ${Utils.prettyWeight(grams)}`
  } else {
    r += `${Utils.prettyWeight(grams)}`
  }
  r += ")</span>"
  return r
}

function calcScale(inc) {
  const servings = gon.recipe_servings_quantity
  window.currentServings = window.currentServings + inc
  window.scale = window.currentServings / window.originalServings
}

function scaleRaw(raw) {
  if (!raw) {return ""}
  var quantity = new Quantity({raw: raw})
  var v = Utils.prettyFraction(quantity.nb*window.scale)
  if (quantity.label) {return v + " " + quantity.label}
  return v
}

function updateServingsInputField() {
  const elem = document.getElementById("servings-input-field");
  elem.value = new Servings(elem.dataset.initial).scale(window.scale).print()
}

function updateIngredientQtyInputField() {
  const elem = document.getElementById("ingredient-qty-input-field");
  elem.value = scaleRaw(elem.dataset.quantity)
}

function updateScalableQuantities() {
  var elements = document.querySelectorAll('[data-scalable-qty]');
  for (const elem of elements) {
    const original = elem.dataset.scalableQty
    //var val = parseFloat(elem.innerHTML)
    elem.innerHTML = "" + Utils.prettyFraction(original*window.scale)
  }
}

function updateScalableVolumes() {
  var elements = document.querySelectorAll('[data-scalable-volume]');
  for (const elem of elements) {
    const ml = elem.dataset.scalableVolume
    //var val = parseFloat(elem.innerHTML)
    elem.innerHTML = "" + Utils.prettyVolume(ml*window.scale, elem.dataset.isLiquid)
  }
}

function updateScalableWeights() {
  var elements = document.querySelectorAll('[data-scalable-weight]');
  for (const elem of elements) {
    const grams = elem.dataset.scalableWeight
    elem.innerHTML = "" + Utils.prettyWeight(grams*window.scale)
  }
}

function updateScalableDetailedIngredients() {
  var elements = document.querySelectorAll('[data-scalable-ingredient-detailed]');
  for (const elem of elements) {
    elem.innerHTML = "" + prettyDetailedIngredient(elem)
  }
}

function updateScalableIngredients() {
  var elements = document.querySelectorAll('[data-scalable-ingredient]');
  for (const elem of elements) {
    elem.innerHTML = "" + prettyIngredient(elem)
  }
}

function updateIngredientsWithId() {
  var elements = document.querySelectorAll('[data-ingredient-id]');
  for (const elem of elements) {
    const ing = gon.ingredients[elem.dataset.ingredientId]
    elem.innerHTML = "" + prettyIngredientV2(ing)
  }
}

function _createFilterTag(color, text) {
  var span = document.createElement('span')
  span.className = "filter-" + color
  span.innerHTML = text + " X"
  span.addEventListener('click', event => {
    span.remove()
  })
  return span
}

function addFilterTag(color, text) {
  const activeFilters = document.getElementById("active-filters");
  if (activeFilters.childElementCount == 0) {activeFilters.innerHTML = ""}
  activeFilters.appendChild(_createFilterTag(color, text))
}

function numDigits(x) {
  return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}

document.addEventListener("DOMContentLoaded", function(event) {

  addRecipeToBook(document.getElementById('add-to-book-btn'))
  
  const servings = gon.recipe_servings_quantity
  window.originalServings = parseInt(servings.innerHTML)
  window.currentServings = window.originalServings

  window.scale = 1.0
  
  const lessButton = document.getElementById("less-servings-button");
  const moreButton = document.getElementById("more-servings-button");
  const servingsField = document.getElementById("servings-input-field");
  const inField = document.getElementById("ingredient-qty-input-field");
  const inIngs = document.getElementById("input-ingredients");

  const changeScale = (scale) => {
    window.scale = scale
    updateServingsInputField()
    updateScalableQuantities()
    updateScalableVolumes()
    updateScalableWeights()
    updateScalableIngredients()
    updateScalableDetailedIngredients()
    updateIngredientsWithId()
    updateIngredientQtyInputField()
  }

  var elements = document.querySelectorAll('.filter-add-red-ing-link');
  for (const elem of elements) {
    elem.addEventListener('click', event => {
      addFilterTag("red", elem.innerHTML);
    })
  }

  var elements = document.querySelectorAll('.filter-add-green-diet-link');
  for (const elem of elements) {
    elem.addEventListener('click', event => {
      addFilterTag("green", elem.innerHTML);
    })
  }

  var elements = document.querySelectorAll('.filter-add-green-ing-link');
  for (const elem of elements) {
    elem.addEventListener('click', event => {
      addFilterTag("green", elem.innerHTML);
    })
  }
  
  moreButton.addEventListener('click', event => {
    let scale = window.scale
    changeScale(scale >= 1 ? scale + 1 : 1/(1/scale-1))
  })
  
  lessButton.addEventListener('click', event => {
    let scale = window.scale
    changeScale(scale > 1 ? scale - 1 : 1/(1/scale+1))
  })
  
  inField.addEventListener('change', event => {
    var qty = new Quantity({raw: inField.value})
    const inIng = gon.ingredients[inIngs.value]
    var grams = Utils.toGrams(qty.nb, qty.unit, inIng.unit_weight, inIng.density)
    changeScale(grams / inIng.grams)
  })
  
  servingsField.addEventListener('change', event => {
    var initial = new Servings(servingsField.dataset.initial).average()
    var now = new Servings(servingsField.value).average()
    console.log("initial", initial)
    console.log("now", now)
    changeScale(now / initial)
  })
  
  inIngs.addEventListener('change', event => {
    const inIng = gon.ingredients[inIngs.value]
    inField.value = scaleRaw(inIng.raw)
  })
})
