
document.addEventListener("DOMContentLoaded", function(event) { 

  elem = document.getElementById('unit_system')
  elem.addEventListener("change", function(e) {
    window.location.search = '&unit_system_id='+e.target.value;
    //window.location.search += '&unit_system_id='+e.target.value;
    //$.ajax({
    //  type: "POST",
    //  url: "/users/select_unit_system",
    //  data: {
    //    authenticity_token: $('[name="csrf-token"]')[0].content,
    //    unit_system_id: ,
    //    recipe_id: el.data('id')
    //  }
    //});
    //location.reload();
  })

});
