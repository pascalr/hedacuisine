document.addEventListener("DOMContentLoaded", function(event) { 
  
  var elems = document.getElementsByClassName("calendar-day");
  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", function(ev) {
      document.getElementById("new_meal_form_year").value = this.dataset["year"];
      document.getElementById("new_meal_form_month").value = this.dataset["month"];
      document.getElementById("new_meal_form_day").value = this.dataset["day"];
      document.getElementById("new_meal_form").submit();
      //window.location = this.dataset["path"]
      //$.ajax({
      //    url: "/machine/"+machine_id+"/meals",
      //    type: "POST",
      //    data: {meal: {
      //             recipe_id: val,
      //             field2: val, etc... }},
      //    success: function(resp){ }
      //});

    }, false)
  }

  elems = document.getElementsByClassName("inner-link");
  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", function(ev) {
      ev.stopPropagation();
    }, false)
  }
})
