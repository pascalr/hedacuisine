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
    console.log("Connecting sortable controller")
    let handle = this.element.dataset.handle
    this.sortable = Sortable.create(this.element, {
      handle: handle,
      onEnd: this.end.bind(this)
    })
  }

  end(event) {
    //let id = event.item.dataset.id
    let url = event.item.dataset.url
    let data = new FormData()
    data.append('item_nb', event.newIndex + 1) // TODO: Rename item_nb to position
    data.append('position', event.newIndex + 1)

    console.log(event.newIndex + 1)

    //var region = document.getElementById("region").innerHTML

    Rails.ajax({
      url: url,//this.data.get("base-url")+"/recipe_ingredients/"+id+"/move",
      type: 'PATCH',
      data: data
    })
  }
}
