//require("jquery")

document.addEventListener("DOMContentLoaded", function(event) { 

  var rows = document.getElementsByClassName('recipe_row')
  for (var i = 0; i < rows.length; i++) {
    var row = rows.item(i)

    row.addEventListener("mouseenter", function(evt) { 
      var elem = document.getElementById('add_recipe_comment_' + evt.target.dataset.id)
      elem.hidden = false
    })
    row.addEventListener("mouseleave", function(evt) { 
      var elem = document.getElementById('add_recipe_comment_' + evt.target.dataset.id)
      elem.hidden = true
    })
  }

  var plus = document.getElementsByClassName('add_recipe_comment')
  for (var i = 0; i < plus.length; i++) {
    var p = plus.item(i)
    
    p.addEventListener("click", function(evt) { 
      var elem = document.getElementById('add_comment_form')
      var id = evt.target.id.substr(19)
      document.getElementById('add_comment_form_recipe_id').value = id
      elem.style.left = evt.clientX+'px';
      elem.style.top = evt.clientY+'px';
      elem.hidden = false
    })
  }
});
