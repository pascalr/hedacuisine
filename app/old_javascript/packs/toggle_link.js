
document.addEventListener("DOMContentLoaded", function(event) { 

  var links = document.getElementsByClassName('toggle-link')
  for (var i = 0; i < links.length; i++) {
    var link = links.item(i)
    document.getElementById(link.dataset.toggleId).hidden = true;
    link.addEventListener("click", function(e) {
      var elem = document.getElementById(e.target.dataset.toggleId);
      e.target.classList.toggle("toggle-link-active");
      e.target.innerHTML = (elem.hidden ? "-" : "+") + e.target.innerHTML.substring(1)
      elem.hidden = !elem.hidden
    })
  }
  
  links = document.getElementsByClassName('toggle-link-visible')
  for (var i = 0; i < links.length; i++) {
    var link = links.item(i)
    link.addEventListener("click", function(e) {
      var elem = document.getElementById(e.target.dataset.toggleId);
      e.target.classList.toggle("toggle-link-active");
      e.target.innerHTML = (elem.hidden ? "-" : "+") + e.target.innerHTML.substring(1)
      elem.hidden = !elem.hidden
    })
  }

});
