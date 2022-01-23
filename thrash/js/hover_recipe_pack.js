function hoverRecipe() {
  //item.setAttribute("style", "background-color:blue;")
  //ssName("myImg")[0].src = "hackanm.gif";
  console.log(this.dataset["recipe_name"])
  console.log(this.dataset["recipe_src"])
  var name = document.getElementById("preview_recipe_name")
  name.innerHTML = this.dataset["recipe_name"]
  var im = document.getElementById("preview_recipe_image")
  im.src = this.dataset["recipe_src"]
}

document.addEventListener("DOMContentLoaded", function(event) { 
  console.log("Loaded hover_recipe_pack");
  var elements = document.getElementsByClassName("hover_recipe");
  for (var i = 0; i < elements.length; i++) {
    var e = elements[i]
  
    e.addEventListener("mouseover", hoverRecipe, false);
    //item.addEventListener("mouseout", hover, false);
  }
});
