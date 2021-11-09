// https://stackoverflow.com/questions/25888963/min-by-max-by-equivalent-functions-in-javascript

//export default class Quantity {
class Quantity {

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
      let qty_s = s[0]
      this.label = this.raw.substr(qty_s.length).trim()
      this.nb = Quantity.parseFloatOrFraction(qty_s)
      this.unit = gon.units.find(unit => unit.name == this.label)
    }
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
        return parseInt(whole, 10) + parseFractionFloat(fraction)
      } else {
        return parseFractionFloat(qty_s)
      }
    } else {
      return parseFloat(qty_s)
    }
  }
}

function minBy(array, fn) { 
  return extremumBy(array, fn, Math.min); 
};
function maxBy(array, fn) { 
  return extremumBy(array, fn, Math.max);
};
function extremumBy(array, pluck, extremum) {
  return array.reduce(function(best, next) {
    var pair = [ pluck(next), next ];
    if (!best) {
       return pair;
    } else if (extremum.apply(null, [ best[0], pair[0] ]) == best[0]) {
       return best;
    } else {
       return pair;
    }
  },null)[1];
}

function translated(str) {
  return str
}

function toGrams(val, unit, unit_weight, density) {
  if (!unit) {
    return val * unit_weight
  } else if (unit.is_weight) {
    return val * unit.value
  } else if (unit.is_volume) {
    return val * unit.value * density
  }
  return val * unit.value * unit_weight
}
  
function prettyFraction(value) {
  var fractions = [0, 1/8, 1/4, 1/3, 1/2, 2/3, 3/4, 7/8, 1]
  var pp_fractions = ["0", "1/8", "1/4", "1/3", "1/2", "2/3", "3/4", "7/8", "1"]
  var i_part = parseInt(value, 10)
  var f_part = value % 1
  var f = minBy(fractions, x => Math.abs(f_part-x))
  if (f == 0) {return i_part.toString();}
  if (f == 1) {return (i_part+1).toString();}
  var pf = pp_fractions[fractions.indexOf(f)]
  if (i_part == 0) {return pf;}
  return `${i_part} ${pf}`
}

function prettyWeight(grams) {
  if (!grams) {return "";}
  if (grams >= 1000.0) {return `${prettyNumber(grams/1000.0)} kg`;} 
  return `${prettyNumber(grams)} g`
}

function prettyMetricVolume(ml) {
  if (!ml) {return "";}
  if (ml >= 1000.0) {return `${prettyNumber(ml/1000.0)} L`;} 
  return `${prettyNumber(ml)} mL`
}

function prettyNumber(nb) {
  //return Math.round(nb*100)/100
  return Number.parseFloat(Number.parseFloat(nb).toPrecision(3));
}

function prettyVolume(ml, is_liquid) {
  if (!ml) {return "";}
  if (is_liquid && ml >= 1000.0) {return `${prettyFraction(ml/1000.0)} ${translated("L")}`;} 
  if (ml >= 60.0) {return `${prettyFraction(ml/250.0)} ${translated("t")}`;} 
  if (ml >= 15.0) {return `${prettyFraction(ml/15.0)} ${translated("c. à soupe")}`;}
  if (ml >= 5.0/8.0) {return `${prettyFraction(ml/5.0)} ${translated("c. à thé")}`;}
  return `${prettyFraction(ml/0.31)} ${translated("pincée")}`
}

function prettyIngredient(ing) {

  var linkSingular = "<a href='/foods/"+ing.dataset.foodId+"'>"+ing.dataset.foodNameSingular+"</a> "

  if (ing.dataset.raw == null || ing.dataset.raw == "") {return linkSingular}

  var quantity = new Quantity({raw: ing.dataset.raw})
  var unit = quantity.unit
  var qty = quantity.nb * window.scale
  if (unit) {qty *= unit.value}

  if (unit && unit.is_weight) {
    var r = prettyWeight(qty) + " "
  } else if (unit && unit.is_volume) {
    var r = prettyVolume(qty) + " "
  } else {
    var r = prettyFraction(qty) + " "
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
    r += `${prettyVolume(ml)} · ${prettyMetricVolume(ml)}`
  } else if (unit && unit.is_volume) {
    // TODO: Show unit quantity if food can be unit.
    // FIXME: What if it is already metric???
    r += `${prettyMetricVolume(ml)} · ${prettyWeight(grams)}`
  } else {
    r += `${prettyWeight(grams)}`
  }
  r += ")</span>"
  return r
}

function parseFractionFloat(str) {
  var split = str.split('/')
  return split[0]/split[1]
}

function calcScale(inc) {
  const servings = document.getElementById("servings-quantity-value");
  window.currentServings = window.currentServings + inc
  window.scale = window.currentServings / window.originalServings
}

function scaleRaw(raw) {
  if (!raw) {return ""}
  var quantity = new Quantity({raw: raw})
  var v = prettyFraction(quantity.nb*window.scale)
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
    elem.innerHTML = "" + prettyFraction(original*window.scale)
  }
}

function updateScalableVolumes() {
  var elements = document.querySelectorAll('[data-scalable-volume]');
  for (const elem of elements) {
    const ml = elem.dataset.scalableVolume
    //var val = parseFloat(elem.innerHTML)
    elem.innerHTML = "" + prettyVolume(ml*window.scale, elem.dataset.isLiquid)
  }
}

function updateScalableWeights() {
  var elements = document.querySelectorAll('[data-scalable-weight]');
  for (const elem of elements) {
    const grams = elem.dataset.scalableWeight
    elem.innerHTML = "" + prettyWeight(grams*window.scale)
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
  if (positive) {
    if (nb <= 0.064) {return 0.125}
    else if (nb <= 0.5) {return nb * 2.0}
    else if (nb < 1.0) {return 1.0}
    return nb + Math.pow(10, numDigits(Math.min(nb, nb0))-1)
  } else {
    if (nb <= 0.25) {return 0.125}
    else if (nb <= 1.0) {return nb / 2.0}
    let i = Math.pow(10, numDigits(Math.min(nb, nb0))-1)
    return parseInt(nb) == i ? nb - Math.pow(10, numDigits(Math.min(nb, nb0))-2) : nb - i
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  
  const servings = document.getElementById("servings-quantity-value");
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
    servingsField.value = prettyFraction(v) + " " + qty.label
    var event = new Event('change');
    event.forced = true
    servingsField.dispatchEvent(event);
  })
  
  lessButton.addEventListener('click', event => {
    var f0 = new Quantity({raw: servingsField.dataset.initial}).nb
    var qty = new Quantity({raw: servingsField.value})
    var v = getIncValue(qty.nb, f0, false)
    servingsField.value = prettyFraction(v) + " " + qty.label
    var event = new Event('change');
    event.forced = true
    servingsField.dispatchEvent(event);
  })
  
  inField.addEventListener('change', event => {
    var qty = new Quantity({raw: inField.value})
    const inIng = gon.ingredients[inIngs.value]
    var grams = toGrams(qty.nb, qty.unit, inIng.unit_weight, inIng.density)
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
  })
  
  servingsField.addEventListener('change', event => {
    var qty0 = new Quantity({raw: servingsField.dataset.initial})
    var f = new Quantity({raw: servingsField.value}).nb
    servingsField.value = (event.forced ? prettyFraction(f) : f.toString()) + " " + qty0.label
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
