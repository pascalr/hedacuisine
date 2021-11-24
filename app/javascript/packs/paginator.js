document.addEventListener("DOMContentLoaded", function(event) {

  const currentPage = document.getElementById("current-page");

  function changePage(pageNb) {
    console.log('CHANGE PAGE', pageNb)
    let url = gon.pages[pageNb-1].url
    $.get(url, function(data) {
      currentPage.innerHTML = data;
      document.getElementById("page-number").innerHTML = pageNb
    });
  }

  // TODO: Update URL
  // TODO: Update links. Disable if at the end.

  const previous = document.getElementById("previous-recipe-link");
  if (previous != null) {
    previous.addEventListener("click", function(evt) {
      evt.preventDefault();
      gon.current_page = Math.max(1, gon.current_page - 1)
      changePage(gon.current_page)
    })
  }

  const next = document.getElementById("next-recipe-link");
  if (next != null) {
    next.addEventListener("click", function(evt) {
      evt.preventDefault();
      gon.current_page = gon.current_page + 1
      changePage(gon.current_page)
    })
  }

})
