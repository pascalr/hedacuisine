document.addEventListener("DOMContentLoaded", function(event) {

  const currentPage = document.getElementById("current-page");

  function createMissingLink(isNext) {
    let link = document.createElement('a')
    link.id = `${isNext ? 'next' : 'previous'}-recipe-link`
    let im = document.createElement('img')
    im.src = `/icons/chevron-${isNext ? 'right' : 'left'}.svg`
    link.appendChild(im)
    let container = document.getElementById(`${isNext ? 'next' : 'previous'}-container`);
    container.innerHTML = ''
    container.appendChild(link)
    return link
  }

  function updateLink(link, disabled) {
    link.style.opacity = disabled ? 0.5 : 1.0
    link.style.cursor = disabled ? "default" : "pointer"
  }

  function changePage(pageNb) {
    console.log('CHANGE PAGE', pageNb)
    let url = gon.pages[pageNb-1].url
    $.get(url, function(data) {
      currentPage.innerHTML = data;
      document.getElementById("page-number").innerHTML = pageNb
      updateLink(document.getElementById("previous-recipe-link"), pageNb == 1)
      updateLink(document.getElementById("next-recipe-link"), pageNb == gon.pages.length)
      window.history.pushState(pageNb.toString(), '', url.slice(0,-5));
    });
  }

  let previous = document.getElementById("previous-recipe-link");
  if (previous == null) {previous = createMissingLink(false)}
  previous.addEventListener("click", function(evt) {
    evt.preventDefault();
    if (gon.current_page == 1) {return;}
    gon.current_page = Math.max(1, gon.current_page - 1)
    changePage(gon.current_page)
  })

  let next = document.getElementById("next-recipe-link");
  if (next == null) {next = createMissingLink(true)}
  next.addEventListener("click", function(evt) {
    evt.preventDefault();
    if (gon.current_page == gon.pages.length) {return;}
    gon.current_page = gon.current_page + 1
    changePage(gon.current_page)
  })

})
