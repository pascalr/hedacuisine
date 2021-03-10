import { tns } from "tiny-slider/src/tiny-slider"

document.addEventListener("DOMContentLoaded", function(event) { 

  var slider = tns({
    container: "#versions-slider",
    items: 1,
    //autoWidth: true,
    //gutter: 10,
    nav: false,
    center: true,
    loop: true,
    prevButton: '#prev-button',
    nextButton: '#next-button',
    speed: 200
    //lazyload: true,
    //controlsText: ["🡨", "🡪"],
  });
});

