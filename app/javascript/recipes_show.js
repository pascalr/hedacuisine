// https://stackoverflow.com/questions/25888963/min-by-max-by-equivalent-functions-in-javascript

import {Utils} from "./recipe_utils"
import Quantity from './models/quantity'
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
  elem.value = scaleRaw(elem.dataset.initial)
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
function getIncValue(nb, nb0, positive) {
  let multiplying = nb > nb0
  let current = Math.round(multiplying ? (nb / nb0) : (nb0 / nb))
  let now = (!positive == !multiplying) ? (current + 1) : (current - 1)
  if (now == 0) { now = 2; multiplying = !multiplying }
  return multiplying ? (nb0 * now) : (nb0 / now)
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
    var f0 = new Quantity({raw: servingsField.dataset.initial}).nb
    var qty = new Quantity({raw: servingsField.value})
    var v = getIncValue(qty.nb, f0, true)
    servingsField.value = Utils.prettyFraction(v) + " " + qty.label
    var event = new Event('change');
    event.forced = true
    servingsField.dispatchEvent(event);
  })
  
  lessButton.addEventListener('click', event => {
    var f0 = new Quantity({raw: servingsField.dataset.initial}).nb
    var qty = new Quantity({raw: servingsField.value})
    var v = getIncValue(qty.nb, f0, false)
    servingsField.value = Utils.prettyFraction(v) + " " + qty.label
    var event = new Event('change');
    event.forced = true
    servingsField.dispatchEvent(event);
  })
  
  inField.addEventListener('change', event => {
    var qty = new Quantity({raw: inField.value})
    const inIng = gon.ingredients[inIngs.value]
    var grams = Utils.toGrams(qty.nb, qty.unit, inIng.unit_weight, inIng.density)
    window.scale = grams / inIng.grams
    //console.log(f)
    //console.log(grams)
    //console.log(inIng.grams)
    //console.log(scale)
    updateServingsInputField()
    updateScalableQuantities()
    updateScalableVolumes()
    updateScalableWeights()
    updateScalableIngredients()
    updateScalableDetailedIngredients()
    updateIngredientsWithId()
  })
  
  servingsField.addEventListener('change', event => {
    var qty0 = new Quantity({raw: servingsField.dataset.initial})
    var f = new Quantity({raw: servingsField.value}).nb
    servingsField.value = (event.forced ? Utils.prettyFraction(f) : f.toString()) + " " + qty0.label
    window.scale = f / qty0.nb
    //console.log(f)
    //console.log(f0)
    //console.log(scale)
    updateIngredientQtyInputField()
    updateScalableQuantities()
    updateScalableVolumes()
    updateScalableWeights()
    updateScalableIngredients()
    updateScalableDetailedIngredients()
    updateIngredientsWithId()
  })
  
  inIngs.addEventListener('change', event => {
    const inIng = gon.ingredients[inIngs.value]
    inField.value = scaleRaw(inIng.raw)
  })
  

  //var elements = document.querySelectorAll('[data-scalable]');
  //for (const elem of elements) {
  //  const model = elem.dataset.model
  //  const url = elem.dataset.url
  //  const column = elem.dataset.updateColumn
  //  elem.addEventListener("focusout", function() {
  //    $.ajax({
  //      type: "PATCH",
  //      url: url,
  //      data: {
  //        authenticity_token: $('[name="csrf-token"]')[0].content,
  //        [model]: {
  //          [column]: elem.innerHTML
  //        }
  //      }
  //    });
  //  });
  //}

  //const button = document.getElementById("add-recipe-ingredient-form");

  //button.addEventListener('click', event => {
  //  const originalForm = document.getElementById("new-recipe-ingredient-form");
  //  var form = originalForm.cloneNode(true)
  //  form.removeAttribute("id")
  //  form.classList.remove("invisible");
  //  //originalForm.parentNode.insertBefore(form, originalForm.nextElementSibbling)
  //  originalForm.insertAdjacentElement('beforebegin', form)

  //  var elem = form.querySelector('[data-autocomplete]');
  //  new autocomplete({
  //    selector: elem,
  //    minChars: 1,
  //    source: function(term, suggest){
  //      term = term.toLowerCase();
  //      const choices = JSON.parse(document.getElementById(elem.dataset.autocomplete).dataset.values)
  //      const matches = [];
  //      for (let i = 0; i < choices.length; i++)
  //          if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
  //      suggest(matches);
  //    }
  //  })
  //});

  //const element = document.getElementById("new-recipe-ingredient");
  //element.addEventListener("ajax:success", (event) => {
  //  const [_data, _status, xhr] = event.detail;
  //  document.getElementById("new-raw-quantity").value = ''
  //  document.getElementById("autocomplete-food").value = ''
  //  document.getElementById("autocomplete-food-id").value = ''
  //  //element.insertAdjacentHTML("beforeend", xhr.responseText);
  //});
  //element.addEventListener("ajax:error", () => {
  //  element.insertAdjacentHTML("beforeend", "<p>ERROR</p>");
  //});


})
