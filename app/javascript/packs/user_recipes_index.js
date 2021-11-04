document.addEventListener("DOMContentLoaded", function(event) {

  const previous = document.getElementById("previous-recipe-link");
  const next = document.getElementById("next-recipe-link");

  const currentPage = document.getElementById("current-page");
  window.currentPageNb = parseInt(currentPage.dataset.page)

  function changePage(pageNb) {
    let url = currentPage.dataset.replaceUrl.replace('%7B%7B%7D%7D', currentPageNb)
    $.get(url, function(data) {
      currentPage.innerHTML = data;
      elems = document.getElementsByClassName("page-number");
      for (var i = 0; i < elems.length; i++) {
        elems[i].innerHTML = pageNb
      }
    });
  }

  previous.addEventListener("click", function(evt) {
    evt.preventDefault();
    // TODO: Add class disable to link when at first page
    window.currentPageNb = Math.max(1, currentPageNb - 1)
    changePage(currentPageNb)
  })

  next.addEventListener("click", function(evt) {
    evt.preventDefault();
    // TODO: Add class disable to link when at last page
    window.currentPageNb = Math.min(currentPage.dataset.max, currentPageNb + 1)
    changePage(currentPageNb)
  })

})
