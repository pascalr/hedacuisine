document.addEventListener("DOMContentLoaded", function(event) { 
  
  var elems = document.getElementsByClassName("calendar-day");
  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", function(ev) {
      window.location = this.dataset["path"]
    }, false)
  }

  elems = document.getElementsByClassName("inner-link");
  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", function(ev) {
      ev.stopPropagation();
    }, false)
  }
})
