document.addEventListener("DOMContentLoaded", function(event) { 

  //var container = document.getElementById('top-search-container')
  //var container = document.getElementById('search-image')

  var container = $('#top-search-container')
  var whole = $("#whole-page-search")
  var searchResults = $('#search-results')

  /* FIXME: Accessible from keyboard only */
  container.on('click', (evt) => {
    console.log('clicked')
    //container.hide();
    whole.slideDown();
    //$("#top-search").animate({translateY: "-500px"});
    //container.css("transform", "translateY(20vh) !important");
    //container.css("margin-top", "3rem");
    //container.css("width", "80%");
    //container.css("background-color", "red")
    //container.width("100vw");
    //container.height("100vh");
    //container.css("transform", "translateX(0)");
    //$("#whole-page-search").slideDown("slow", function() {
    //container.slideDown("slow", function() {
      // Animation complete.
    //});
  });
  container.on('focusout', (evt) => {
    whole.slideUp()
  });
  url = "/fr/recettes.json" // FIXME: Pass this as a data attribute, this way it handles the language too.
  $.get(url, function(data) {
    console.log("data:", data)
    data.forEach(recipe => {
      searchResults.append($('<li><a href="'+recipe.url+'">'+'<img src="'+recipe.image+'"></img>'+recipe.name+'</a></li>'))
    })
  });
  $.ajax({
    type: "GET",
    url: url,
  });
  //$('.close-search').on('click', (evt) => {
  //  console.log('clicked')
  //  whole.slideUp()
  //});

  /*
  var elem = document.getElementById('whole-page-search')

  var id = setInterval(anim, 5);
  var scale = 0.0
  function anim() {
    scale += 0.01
    elem.style.transform = "scale(1.0, "+scale+")";
    if (scale >= 1.0) {
      clearInterval(id);
    }
  }
  */
  //window.e = new bootstrap.Collapse(elem, {
  //  toggle: false
  //})//, {hide: true})

})
