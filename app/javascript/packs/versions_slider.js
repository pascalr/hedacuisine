import { tns } from "tiny-slider/src/tiny-slider"

document.addEventListener("DOMContentLoaded", function(event) { 

  var slider = tns({
    container: "#versions-slider",
    items: 1,
    //autoWidth: true,
    //gutter: 10,
    nav: false,
    center: true,
    loop: false,
    swipeAngle: false,
    speed: 400
    //prevButton: document.getElementById('prev-tag-'+elements[i].dataset.tagid),
    //nextButton: document.getElementById('next-tag-'+elements[i].dataset.tagid),
    //lazyload: true,
    //controlsText: ["🡨", "🡪"],
  });
});

