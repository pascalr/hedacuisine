document.addEventListener("DOMContentLoaded", function(event) { 

  //var container = document.getElementById('top-search-container')
  //var container = document.getElementById('search-image')

  /* FIXME: Accessible from keyboard only */
  $('.top-search-container').on('click', (evt) => {
  //$('.search-image').on('click', (evt) => {
    console.log('clicked')
    $("#whole-page-search").slideDown("slow", function() {
      // Animation complete.
    });
  });
  $('.close-search').on('click', (evt) => {
    console.log('clicked')
    $("#whole-page-search").slideUp()
  });

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
