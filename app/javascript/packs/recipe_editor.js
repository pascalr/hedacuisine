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
      // TODO: Add all events
      } else if (key == 'onClick') {
        elem.addEventListener('click', args['onClick'])
      } else if (key == 'onBlur') { // When a user leaves an input field
        elem.addEventListener('blur', args['onBlur'])
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

// Rails.ajax(success: function(), error: function(), complete: function())
// success(response, xhr.statusText, xhr);

// https://guides.rubyonrails.org/working_with_javascript_in_rails.html#rails-ujs-event-handlers

// Rails.ajax is not working because it expects Turbolinks for the response.
// So I am using jQuery.

// Options:
// type: "PATCH" || "GET" || "POST"
// url
// data
//Heda.ajax = function(options) {
//  if (!options['type']) {throw "Heda.ajax: type missing. Expected PATCH, GET or POST"}
//  if (!options['url']) {throw "Heda.ajax: urlmissing."}
//  if (options['type'] == "PATCH" || options["type"] == "POST") {
//    if (!options.data) {options.data = {}}
//    options.data.authenticity_token = $('[name="csrf-token"]')[0].content
//  }
//  $.ajax(options);
//}
// .done(function() {
//    alert( "success" );
//  })
//  .fail(function() {
//    alert( "error" );
//  })
//  .always(function() {
//    alert( "complete" );
//  });
//
//    type: "PATCH",
//    url: url,
//    data: {
//      authenticity_token: $('[name="csrf-token"]')[0].content,
//      [model]: {
//        [column]: content
//      }
//    }
//  });
//});
//
//.bind("ajax:success", function() {
//      alert("HELLO");
//    })
//    .bind("ajax:error", function() {
//      alert("GOODBYE");
//    }

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

function addEmptyIng() {
  (gon.recipe.new_ingredients ||= []).push({})
  updateIngList()
}

function showError(response, statusText, xhr) {
  console.log(response)
  console.log(statusText)
  console.log(xhr)
  alert("TODO: showError");
}

function updateIngQuantityCallback(ing) {
  return function(evt) {
    console.log('Update ing quantity.')
    // TODO: Don't send unless the field was modified
    let data = new FormData()
    data.append('recipe_ingredient[raw]', this.value)
    //Rails.ajax({url: ing.url, type: 'PATCH', data: {recipe_ingredient: {raw: this.value}}, success: function() { alert("HELLO"); }, error: function() { alert("GOODBYE"); }})
    Rails.ajax({url: ing.url, type: 'PATCH', data: data, error: showError})
  }
}

function updateIngCommentCallback(ing) {
  return function(evt) {
    console.log('Update ing quantity.')
    // TODO: Don't send unless the field was modified
    let data = new FormData()
    data.append('recipe_ingredient[comment]', this.value)
    //Rails.ajax({url: ing.url, type: 'PATCH', data: {recipe_ingredient: {raw: this.value}}, success: function() { alert("HELLO"); }, error: function() { alert("GOODBYE"); }})
    Rails.ajax({url: ing.url, type: 'PATCH', data: data, error: showError})
  }
}

function renderUpdateIng(ing) {
}

function renderNewIng() {
  "TODO"
}

function updateIngList() {

  var ingEditor = document.getElementById("ing-editor")

  let ings = gon.recipe.ingredients

  let list =
    e("ul", {className: "list-group", style: "max-width: 800px;"}, [...ings.map(ing =>
      e("li", {className: "list-group-item", "data-id": ing.id}, [
        //e("img", {src: "/icons/arrows-move.svg", className: "handle"}),
        e("span", {style: "padding: 0 10px 0 0;", className: "handle"}, e("b", null, ing.item_nb+".")),
        e("input", {onBlur: updateIngQuantityCallback(ing), type: "text", size: "8", value: ing.raw, style: "border: none; border-bottom: 1px solid gray;"}),
        " de ", // " de " ou bien " - " si la quantité n'a pas d'unité => _1_____ - oeuf
        e("a", {href: ing.food.url}, ing.food.name),
        e("span", {style: "margin-left: 10px;"}, [
          "(",
          e("input", {onBlur: updateIngCommentCallback(ing), type: "text", size: "20", value: ing.comment, style: "border: none; border-bottom: 1px solid gray;"}),
          ")"
        ]),
        e("a", {href: ing.url, "data-confirm": "Are you sure?", "data-method": "delete"},
          e("img", {src: "/icons/x-lg.svg", style: "float: right;"})
        )
      ])
    ), ...(gon.recipe.new_ingredients || []).map(ing =>
      e("li", {className: "list-group-item"}, "TODO")
    )])
  Sortable.create(list, {
    handle: ".handle",
    onEnd: updateListOrder
  })

  let addButton = e("img", {src: "/icons/plus-circle.svg", style: "width: 2.5rem; padding: 0.5rem;", onClick: addEmptyIng})

  ingEditor.innerHTML = ""
  ingEditor.appendChild(list)
  ingEditor.appendChild(addButton)
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
