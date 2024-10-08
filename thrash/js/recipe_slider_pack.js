require("jquery")
require("tiny-slider")

import { tns } from "tiny-slider/src/tiny-slider"

document.addEventListener("DOMContentLoaded", function(event) { 

  var slider = tns({
    container: "#recipe-carrousel-1",
    items: 4,
    slideBy: 'page',
    gutter: 10,
    nav: false,
    loop: false,
    speed: 1200,
    prevButton: document.getElementById('prev-recipe'),
    nextButton: document.getElementById('next-recipe'),
    //lazyload: true,
    //controlsText: ["🡨", "🡪"],
  });
});

