import { tns } from "tiny-slider/src/tiny-slider"

document.addEventListener("DOMContentLoaded", function(event) { 
//document.addEventListener("turbolinks:load", function(event) { 
  console.log("recipe_slider: DOMEContentLoaded");
  //console.log("recipe_slider: turbolinks:load");
  var elements = document.getElementsByClassName("items");
  for (var i = 0; i < elements.length; i++) {

    if (elements[i].dataset.already_loaded) return;
    elements[i].dataset.already_loaded = true;

    var slider = tns({
      container: elements[i],
      items: 4,
      slideBy: 'page',
      autoWidth: true,
      //gutter: 10,
      nav: false,
      prevButton: document.getElementById('prev-tag-'+elements[i].dataset.tagid),
      nextButton: document.getElementById('next-tag-'+elements[i].dataset.tagid),
      //lazyload: true,
      //controlsText: ["🡨", "🡪"],
    });
  }
});

