require("jquery")
require("../jquery.star-rating-svg.js")

document.addEventListener("DOMContentLoaded", function(event) { 

  $(".rating").starRating({
    initialRating: 0,
    strokeWidth: 10,
    starSize: 18,
    readOnly: true
  });

});
