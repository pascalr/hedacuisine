
document.addEventListener("DOMContentLoaded", function(event) { 

  var links = document.getElementsByClassName('toggle-link')
  for (var i = 0; i < links.length; i++) {
    var link = links.item(i)
    document.getElementById(link.dataset.toggle_id).hidden = true;
    link.addEventListener("click", function(e) {
      var elem = document.getElementById(e.target.dataset.toggle_id);
      elem.hidden = !elem.hidden
    })
  }

});
