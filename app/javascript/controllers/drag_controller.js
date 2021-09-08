// Visit The Stimulus Handbook for more details 
// https://stimulusjs.org/handbook/introduction
// 
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import { Controller } from "stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  connect() {
    this.sortable = Sortable.create(this.element, {
      onEnd: this.end.bind(this)
    })
  }

  end(event) {
    let id = event.item.dataset.id
    let data = new FormData()
    data.append('item_nb', event.newIndex + 1)

    console.log(event.newIndex + 1)

    Rails.ajax({
      url: "/recipes/"+this.data.get("recipe-id")+"/recipe_ingredients/"+id+"/move",
      type: 'PATCH',
      data: data
    })
  }
}
