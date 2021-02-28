require("jquery")
require("../jquery.star-rating-svg.js")

document.addEventListener("DOMContentLoaded", function(event) { 

  $(".rating").starRating({
    initialRating: 0,
//    strokeColor: '#894A00',
//    ratedColor: '#894A00',
//    disableAfterRate: false,
    strokeWidth: 10,
//    readOnly: true, TODO: Do this when there is no current user.
    //    Maybe change color based on if it is a user rating or if it is general rating.
    starSize: 18,
    callback: function(currentRating, el){
      //alert('rated ' + currentRating);
      //console.log('DOM element ', el);
      $.ajax({
        type: "POST",
        url: "/recipe_ratings",
        data: {
          authenticity_token: $('[name="csrf-token"]')[0].content,
          rating: currentRating,
          recipe_id: el.data('id')
        }
      });
    }
  });

});
