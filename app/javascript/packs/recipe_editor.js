import Sortable from "sortablejs"

function e(tagName, args={}, children=null) {
  let elem = document.createElement(tagName)
  if (args != null) {
    Object.keys(args).forEach(function(key) {
      let value = args[key]
      if (key == 'className') {
        elem.classList.add(args['className']);
      } else if (key == 'value') {
        elem.value = args['value'] || ''
      } else {
        elem.setAttribute(key, value)
      }
    })
  }

  if (children != null && children.constructor === Array) {
    for (let i = 0; i < children.length; i++) {
      // FIXME: THIS IS DUPLICATED. I SHOULD USE THE CODE BELOW. SO IT WORKS WITH NUMBERS TOO.
      if (typeof children[i] === 'string' || children[i] instanceof String) {
        elem.appendChild(document.createTextNode(children[i]));
      } else {
        elem.appendChild(children[i]);
      }
    }
  } else if (typeof children === 'string' || children instanceof String) {
    elem.appendChild(document.createTextNode(children));
  } else  if (typeof children === 'number') {
    elem.appendChild(document.createTextNode(children.toString()));
  } else if (children != null) {
    elem.appendChild(children);
  }

  return elem
}

function updateListOrder(event) {
  console.log("Update list order.")

  let url = null
  gon.recipe.ingredients.forEach(ing => {
    let nb = ing.item_nb - 1
    if (ing.id == event.item.dataset.id) {
      url = ing.url + "/move"
      ing.item_nb = event.newIndex + 1
    } else if (nb > event.oldIndex && nb <= event.newIndex) {
      ing.item_nb -= 1
    } else if (nb < event.oldIndex && nb >= event.newIndex) {
      ing.item_nb += 1
    }
  })
  gon.recipe.ingredients.sort((a, b) => a.item_nb - b.item_nb)

  let data = new FormData()
  data.append('item_nb', event.newIndex + 1)
  Rails.ajax({url: url, type: 'PATCH', data: data})

  updateIngList();
}

function updateIngList() {

  var ingEditor = document.getElementById("ing-editor")

  let ings = gon.recipe.ingredients

  let list =
    e("ul", {className: "list-group", style: "max-width: 800px;"}, ings.map(ing =>
      e("li", {className: "list-group-item", "data-id": ing.id}, [
        //e("img", {src: "/icons/arrows-move.svg", className: "handle"}),
        e("span", {style: "margin: 0 10px 0 0;"}, e("b", null, ing.item_nb+".")),
        e("input", {type: "text", size: "10", value: ing.raw, style: "border: none; border-bottom: 1px solid gray;"}),
        " de ", // " de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf
        e("input", {type: "text", size: "10", value: ing.food.name, style: "border: none; border-bottom: 1px solid gray;"}),
        e("span", {style: "margin-left: 10px;"}, [
          "(",
          e("input", {type: "text", size: "20", value: ing.comment, style: "border: none; border-bottom: 1px solid gray;"}),
          ")"
        ]),
        e("img", {src: "/icons/x-lg.svg", style: "float: right;"}),
        e("img", {src: "/icons/arrows-move.svg", className: "handle", style: "float: right; margin-right: 10px;"})
      ])
    ))
  Sortable.create(list, {
    handle: ".handle",
    onEnd: updateListOrder
  })

  ingEditor.innerHTML = ""
  ingEditor.appendChild(list)
}

document.addEventListener("DOMContentLoaded", function(event) { 

  updateIngList();

//<div>
//    <ul data-controller="drag" data-drag-base-url="<%= recipe_path(@recipe) %>" data-handle=".handle">
//      <% @recipe.recipe_ingredients.order(:item_nb).each do |ingredient| %>
//        <li class="list-group-item" data-url="<%= recipe_recipe_ingredient_move_path(@recipe, ingredient) %>">
//          <span style="margin: 0 10px;"><b><%= ingredient.item_nb %>.</b></span>
//          <%= form_with(model: [@recipe, ingredient], local: true, class: "inline") do |form| %>
//            <%= form.text_field :raw, size: "10" %>
//            <%= link_to ingredient.food.name, ingredient.food %>
//            <div style="float: right;">
//              <%= form.text_field :comment, size: "18", style: "margin-right: 2rem;" %>
//              <%= form.submit 'modifier' %>
//              <%= link_to 'x', [@recipe, ingredient], method: :delete, data: {confirm: 'Are you sure?'} %>
//            </div>
//          <% end %>
//        </li>
//      <% end %>
//    </ul>
//  <% end %>
//</div>


});
