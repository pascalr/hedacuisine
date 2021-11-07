function e(tagName, args={}, children=null) {
  let elem = document.createElement(tagName)
  if (args != null) {
    if (args['className']) {
      elem.classList.add(args['className']);
    }
    // TODO: Be smarter than this...
    if (args['id']) {
      elem.id = args['id'];
    }
    if (args['id']) {
      elem.id = args['id'];
    }
    if (args['style']) {
      elem.style = args['style'];
    }
    if (args['src']) {
      elem.src = args['src'];
    }
  }

  if (children != null && children.constructor === Array) {
    for (let i = 0; i < children.length; i++) {
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

function renderIngList() {
  let recipe = gon.recipe
  let list = e("ul", {className: "list-group", style: "max-width: 800px;"}, recipe.ingredients.map(ing =>
    e("li", {className: "list-group-item"}, [
      e("img", {src: gon.assetPath.arrowsMove, className: "handle"}),
      e("span", {style: "margin: 0 10px;"}, e("b", null, ing.item_nb+".")),
      ing.food.name
    ])
  ))
  return list
}

document.addEventListener("DOMContentLoaded", function(event) { 

  var ingEditor = document.getElementById("ing-editor")
  ingEditor.appendChild(renderIngList())

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
