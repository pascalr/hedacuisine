document.addEventListener("DOMContentLoaded", function(event) { 
  let e = document.createElement('iframe')
  e.style = "width: 100vw; height: 100vh;"
  e.src = "http://localhost:3000/qc/recettes/323-biscuits_aux_brisures_de_chocolat_ver_2"
  e.title = "download"
  document.querySelector('body').appendChild(e)
});
