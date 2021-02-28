require("jquery")
require("../jquery.star-rating-svg.js")

document.addEventListener("DOMContentLoaded", function(event) { 

  $(".rating").starRating({
    readOnly: true
  });

});
