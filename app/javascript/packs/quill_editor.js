import Quill from "quill"

document.addEventListener('DOMContentLoaded', () => {

  //Block, Inline, and Embed
  //let Inline = Quill.import('blots/inline');
  var Delta = Quill.import('delta');
  var Parchment = Quill.import('parchment');

  //https://stackoverflow.com/questions/47418954/quill-toolbar-alignment-buttons

  //var icons = Quill.import('ui/icons');
  //icons['bold'] = '<i class="fa fa-bold" aria-hidden="true"></i>';
  //icons['italic'] = '<i class="fa fa-italic" aria-hidden="true"></i>';
  //icons['underline'] = '<i class="fa fa-underline" aria-hidden="true"></i>';
  //icons['image'] = '<i class="fa fa-picture-o" aria-hidden="true"></i>';
  //icons['code'] = '<i class="fa fa-code" aria-hidden="true"></i>';
  
  let Id = new Parchment.Attributor.Attribute('id', 'id');
  Parchment.register(Id);

  //class IdBlot extends Inline { };
  //MarkBlot.blotName = 'id-blot';
  //MarkBlot.tagName = 'div';
  //Quill.register(IdBlot);

  // https://quilljs.com/docs/modules/toolbar/
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'header': [3, 4, 5, false] }],
    //[{ 'header': 3 }, { 'header': 4 }, { 'header': 5 }],               // custom button values
    [{ 'list': 'ordered'}],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    ['link'],
    //['blockquote', 'code-block'],
    //[{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    //[{ 'direction': 'rtl' }],                         // text direction
    //[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    //[{ 'font': [] }],
    //[{ 'align': [] }],
    //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //['clean']                                         // remove formatting button
  ];

  // https://quilljs.com/playground/#autosave
  var quill = new Quill('#quill-editor', {
    modules: {
      //toolbar: '#quill-toobar'
      toolbar: toolbarOptions
    },
    placeholder: 'Écrire les instructions...',
    theme: 'snow'
  });
  
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
