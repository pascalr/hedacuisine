import Quantity from './models/quantity'
import Ingredient from './ingredient'

export const Utils = {

  stringSnippet(str, maxLength=20) {
    if (str == null || str == '') {return ''}
    if (str.length <= maxLength) {return str}
    return str.slice(0,17)+'...'
  },

  stripHtml(html) {
    let tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  },

  translated(str) {
    return str
  },

  minBy(array, fn) { 
    return Utils.extremumBy(array, fn, Math.min); 
  },

  maxBy(array, fn) { 
    return Utils.extremumBy(array, fn, Math.max);
  },

  extremumBy(array, pluck, extremum) {
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
  },

  toGrams(val, unit, unit_weight, density) {
    if (!unit) {
      return val * unit_weight
    } else if (unit.is_weight) {
      return val * unit.value
    } else if (unit.is_volume) {
      return val * unit.value * density
    }
    return val * unit.value * unit_weight
  },

  prettyFraction(value) {
    if (value == null) {return null}
    var fractions = [0, 1/8, 1/4, 1/3, 1/2, 2/3, 3/4, 7/8, 1]
    var pp_fractions = ["0", "1/8", "1/4", "1/3", "1/2", "2/3", "3/4", "7/8", "1"]
    var i_part = parseInt(value, 10)
    var f_part = value % 1
    var f = Utils.minBy(fractions, x => Math.abs(f_part-x))
    if (f == 0) {return i_part.toString();}
    if (f == 1) {return (i_part+1).toString();}
    var pf = pp_fractions[fractions.indexOf(f)]
    if (i_part == 0) {return pf;}
    return `${i_part} ${pf}`
  },

  prettyWeight(grams) {
    if (!grams) {return "";}
    if (grams >= 1000.0) {return `${Utils.prettyNumber(grams/1000.0)} kg`;} 
    return `${Utils.prettyNumber(grams)} g`
  },

  prettyMetricVolume(ml) {
    if (!ml) {return "";}
    if (ml >= 1000.0) {return `${Utils.prettyNumber(ml/1000.0)} L`;} 
    return `${Utils.prettyNumber(ml)} mL`
  },

  prettyNumber(nb) {
    //return Math.round(nb*100)/100
    return Number.parseFloat(Number.parseFloat(nb).toPrecision(3));
  },

  prettyVolume(ml, is_liquid) {
    if (!ml) {return "";}
    if (is_liquid && ml >= 1000.0) {return `${Utils.prettyFraction(ml/1000.0)} ${Utils.translated("L")}`;} 
    if (ml >= 60.0) {return `${Utils.prettyFraction(ml/250.0)} ${Utils.translated("t")}`;} 
    if (ml >= 15.0) {return `${Utils.prettyFraction(ml/15.0)} ${Utils.translated("c. à soupe")}`;}
    if (ml >= 5.0/8.0) {return `${Utils.prettyFraction(ml/5.0)} ${Utils.translated("c. à thé")}`;}
    return `${Utils.prettyFraction(ml/0.31)} ${Utils.translated("pincée")}`
  },

  prettyPreposition(foodName) {
    if (foodName == null || foodName.length <= 0) {return ''}
    if (foodName[0] == 'h' || foodName[0] == 'H') {
      return gon.contractionList ? (gon.contractionList.includes(foodName) ? "d'" : "de ") : "de "
    } else {
      return ['a','e','i','o','u','y','é'].includes(foodName[0]) ? "d'" : "de "// if exp.contract_preposition.nil?
    }
  },

  prettyQuantity(raw, food) {
    if (!raw || raw == '') {return ''}
    let qty = new Quantity({raw: raw})
    return qty.pretty() + ' ' + Utils.prettyPreposition(food.name)
  },

  // Very similar to Ingredient.prettyQty which I think is more recent
  prettyQuantityFor(quantity, foodName, scale=1.0) {
    if (!quantity) {return ''}
    if (typeof quantity === 'string' || quantity instanceof String) {
      quantity = new Quantity({raw: quantity})
    }
    if (quantity.nb == null) {return ''}
    var unit = quantity.unit
    var qty = quantity.nb * scale
    if (unit) {qty *= unit.value}

    let r = ''
    if (unit && unit.is_weight) {
      r = Utils.prettyWeight(qty) + " "
    } else if (unit && unit.is_volume) {
      r = Utils.prettyVolume(qty) + " "
    } else {
      r = Utils.prettyFraction(qty) + " "
      if (unit) {r += unit.name + " "}
      else {r = quantity.raw + " "}
    }
    //if (quantity.unit && (quantity.unit.is_volume || quantity.unit.is_weight)) {
    if (quantity.label) {
      r += Utils.prettyPreposition(foodName)
    }
    return r
  },

};
