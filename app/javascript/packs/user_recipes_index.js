document.addEventListener("DOMContentLoaded", function(event) {

  const currentPage = document.getElementById("current-page");
  window.currentPageNb = parseInt(currentPage.dataset.page)

  function changePage(pageNb) {
    let url = currentPage.dataset.replaceUrl.replace('%7B%7B%7D%7D', currentPageNb)
    $.get(url, function(data) {
      currentPage.innerHTML = data;
      attachNextAndPrevious();
    });
  }

  function attachNextAndPrevious() {

    const previous = document.getElementById("previous-recipe-link");
    if (previous != null) {
      previous.addEventListener("click", function(evt) {
        evt.preventDefault();
        window.currentPageNb = Math.max(1, currentPageNb - 1)
        changePage(currentPageNb)
      })
    }

    const next = document.getElementById("next-recipe-link");
    if (next != null) {
      next.addEventListener("click", function(evt) {
        evt.preventDefault();
        window.currentPageNb = currentPageNb + 1
        changePage(currentPageNb)
      })
    }
  }
  attachNextAndPrevious()

})
