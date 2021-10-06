// https://stackoverflow.com/questions/25888963/min-by-max-by-equivalent-functions-in-javascript
Array.prototype.minBy = function(fn) { 
  return this.extremumBy(fn, Math.min); 
};
Array.prototype.maxBy = function(fn) { 
  return this.extremumBy(fn, Math.max);
};
Array.prototype.extremumBy = function(pluck, extremum) {
  return this.reduce(function(best, next) {
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
  
function prettyFraction(value) {
  var fractions = [0, 1/8, 1/4, 1/3, 1/2, 2/3, 3/4, 7/8, 1]
  var pp_fractions = ["0", "1/8", "1/4", "1/3", "1/2", "2/3", "3/4", "7/8", "1"]
  var i_part = parseInt(value, 10)
  var f_part = value % 1
  var f = fractions.minBy (x => Math.abs(f_part-x))
  if (f == 0) {return i_part.toString();}
  if (f == 1) {return (i_part+1).toString();}
  var pf = pp_fractions[fractions.indexOf(f)]
  if (i_part == 0) {return pf;}
  return `${i_part} ${pf}`
}

function prettyNumber(nb) {
  return Math.round(nb*100)/100
}

function prettyVolume(ml, is_liquid) {
  if (!ml) {return "";}
  if (is_liquid && ml >= 1000.0) {return `${prettyFraction(ml/1000.0)} ${translated("L")}`;} 
  if (ml >= 60.0) {return `${prettyFraction(ml/250.0)} ${translated("t")}`;} 
  if (ml >= 15.0) {return `${prettyFraction(ml/15.0)} ${translated("c. à soupe")}`;}
  if (ml >= 5.0/8.0) {return `${prettyFraction(ml/5.0)} ${translated("c. à thé")}`;}
  return `${prettyFraction(ml/0.31)} ${translated("pincée")}`
}

function parseFractionFloat(str) {
  var split = str.split('/')
  return split[0]/split[1]
}

function parseQuantityFloat(str) {

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

function parseQuantityFloatAndLabel(raw) {

  var s = raw.match(/^\d+([,.\/]\d+)?/g)
  var qty_s = s[0]
  var label = raw.substr(qty_s.length).trim()
  //console.log("Qty_s: " + qty_s)
  //console.log("Label: " + label)
  return [parseQuantityFloat(qty_s), label]
}

function calcScale(inc) {
  const servings = document.getElementById("servings-quantity-value");
  window.currentServings = window.currentServings + inc
  window.scale = window.currentServings / window.originalServings
}

function updateServingsInputField() {
  const elem = document.getElementById("servings-input-field");
  var s = parseQuantityFloatAndLabel(elem.dataset.initial)
  var f = s[0]; var label = s[1]
  elem.value = prettyNumber(f*window.scale)
  if (label) {
    elem.value += " " + label
  }
}

function updateIngredientQtyInputField() {
  const elem = document.getElementById("ingredient-qty-input-field");
  var s = parseQuantityFloatAndLabel(elem.dataset.quantity)
  var f = s[0]; var label = s[1]
  elem.value = prettyNumber(f*window.scale)
  if (label) {
    elem.value += " " + label
  }
}

function updateScalableQuantities() {
  var elements = document.querySelectorAll('[data-scalable-qty]');
  for (const elem of elements) {
    const original = elem.dataset.scalableQty
    //var val = parseFloat(elem.innerHTML)
    elem.innerHTML = "" + prettyNumber(original*window.scale)
  }
}

function updateScalableVolumes() {
  var elements = document.querySelectorAll('[data-scalable-volume]');
  for (const elem of elements) {
    const ml = elem.dataset.scalableVolume
    //var val = parseFloat(elem.innerHTML)
    elem.innerHTML = "" + prettyVolume(ml*window.scale, false) // FIXME: Pass is_liquid to the object.
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  
  const servings = document.getElementById("servings-quantity-value");
  window.originalServings = parseInt(servings.innerHTML)
  window.currentServings = window.originalServings

  window.scale = 1.0
  
  const lessButton = document.getElementById("less-servings-button");
  const moreButton = document.getElementById("more-servings-button");
  
  moreButton.addEventListener('click', event => {
    calcScale(1)
    updateServingsInputField()
    updateIngredientQtyInputField()
    updateScalableQuantities()
    updateScalableVolumes()
  })
  
  lessButton.addEventListener('click', event => {
    calcScale(-1)
    updateServingsInputField()
    updateIngredientQtyInputField()
    updateScalableQuantities()
    updateScalableVolumes()
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
