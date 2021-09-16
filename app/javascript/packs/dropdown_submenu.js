$(document).ready(function(){
  $('.submenu-link').on("click", function(e){
    $(this).next('div').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});
