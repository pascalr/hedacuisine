require("jquery")
require("tiny-slider")

import { tns } from "tiny-slider/src/tiny-slider"

document.addEventListener("DOMContentLoaded", function(event) { 

  var elems = document.getElementsByClassName("recipe-carrousel");
  for (var i = 0; i < elems.length; i++) {

     var slider = tns({
       container: '#'+elems.item(i).id,
       //items: 5,
       //responsive: {
       //  600: {
       //    items: 2
       //  },
       //  900: {
       //    items: 3
       //  },
       //  1400: {
       //    items: 4
       //  },
       //  1700: {
       //    items: 5
       //  }
       //},
       fixedWidth: 280,
       //slideBy: 'page',
       //gutter: 50,
       nav: false,
       swipeAngle: false,
       speed: 400,
       loop: false,
       //speed: 1200,
       prevButton: document.getElementById('prev-'+elems.item(i).id),
       nextButton: document.getElementById('next-'+elems.item(i).id),
       //lazyload: true,
       //controlsText: ["🡨", "🡪"],
     });
  }

});

