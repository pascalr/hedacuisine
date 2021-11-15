import Quill from "quill"

//import eggIcon from '../../../public/icons/egg.svg';

const eggIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-egg" viewBox="0 0 16 16">
    <path d="M8 15a5 5 0 0 1-5-5c0-1.956.69-4.286 1.742-6.12.524-.913 1.112-1.658 1.704-2.164C7.044 1.206 7.572 1 8 1c.428 0 .956.206 1.554.716.592.506 1.18 1.251 1.704 2.164C12.31 5.714 13 8.044 13 10a5 5 0 0 1-5 5zm0 1a6 6 0 0 0 6-6c0-4.314-3-10-6-10S2 5.686 2 10a6 6 0 0 0 6 6z"/>
  </svg>
`

const eggFriedIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-egg-fried" viewBox="0 0 16 16">
    <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
  </svg>
`

const listCheckIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-list-check" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
  </svg>
`

document.addEventListener('DOMContentLoaded', () => {

  // In quill, you can either give a div for the toolbar or a object.
  // I prefer using html before it gives more options.
  // For autocomplete input.
  // Also, for dropdowns, CSS is used to control the visual labels for dropdown options. I don't like this. I prefer explicit in HTML.
  
  //Block, Inline, and Embed
  let Inline = Quill.import('blots/inline');
  let Block = Quill.import('blots/block');
  let Embed = Quill.import('blots/embed');
  var Delta = Quill.import('delta');
  var Parchment = Quill.import('parchment');
  var icons = Quill.import('ui/icons');
 
  icons['ing'] = eggFriedIcon;
  icons['ing-list'] = listCheckIcon;

  class IngredientList extends Block {
    static create(value) {
      const node = super.create(value);
      node.setAttribute('data-debug', value);
      return node;
    }
  
    static formats(domNode) {
      return domNode.getAttribute('data-debug');
    }
  
    format(name, value) {
      console.log("format: name, value", [name, value])
      if (name !== this.statics.blotName || !value) {
        console.log('Here')
        super.format(name, value);
      } else {
        console.log('There')
        this.domNode.setAttribute('data-debug', value);
      }
    }
  }
  IngredientList.blotName = 'ing-list';
  IngredientList.tagName = 'div';
  Quill.register(IngredientList);


  let Id = new Parchment.Attributor.Attribute('id', 'id');
  Parchment.register(Id);

  class MarkBlot extends Inline { };
  MarkBlot.blotName = 'mark';
  MarkBlot.tagName = 'mark';
  Quill.register(MarkBlot);

  //var formatWhitelist = ['bold','italic','underline','strike','mark'];

  // https://quilljs.com/playground/#autosave
  var quill = new Quill('#quill-editor', {
    modules: {
      toolbar: '#custom-toolbar'
      //toolbar: options2
    },
    //formats: formatWhitelist,
    placeholder: 'Écrire les instructions...',
    theme: 'snow'
  });

  //// ADDING A CUSTOM BUTTON VERSION 1
  // This adds physically a custom button to the toolbar
  //let test2 = document.createElement('img')
  //test2.src = '/icons/egg.svg'
  //const toolbar = quill.getModule('toolbar')
  //toolbar.container.appendChild(test2)

  // https://github.com/T-vK/DynamicQuillTools/blob/master/DynamicQuillTools.js
  //me.toolbar = quill.getModule('toolbar')
  //me.toolbarEl = me.toolbar.container
  //me.toolbarEl.appendChild(me.qlFormatsEl)
  
  // Store accumulated changes
  var change = new Delta();
  quill.on('text-change', function(delta) {
    change = change.compose(delta);
  });
  
  // Save periodically
  setInterval(function() {
    if (change.length() > 0) {
      console.log('Saving changes', quill.root.innerHTML);

      let data = new FormData()
      data.append('recipe[text]', quill.root.innerHTML)
      Rails.ajax({url: gon.recipe.url, type: 'PATCH', data: data})
      /*
      Send partial changes
      $.post('/your-endpoint', {
        partial: JSON.stringify(change)
      });
      */
      change = new Delta();
    }
  }, 5*1000);
  
  // Check for unsaved data
  window.onbeforeunload = function() {
    if (change.length() > 0) {
      return 'There are unsaved changes. Are you sure you want to leave?';
    }
  }
})

//<span class="ql-formats">
//  <button class="ql-formula"></button>
//  <button class="ql-code-block"></button>
//</span>
//<span class="ql-formats">
//  <button class="ql-clean"></button>
//</span>
//<button class="ql-list" value="ordered"></button>
//<button class="ql-list" value="bullet"></button>
