//document.addEventListener("DOMContentLoaded", function(event) { 
// WOW crazy good answer!!!
// https://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

var editableDiv = document.getElementById('paste-div');

function handlepaste (e) {
    var types, pastedData, savedContent;
    
    // Browsers that support the 'text/html' type in the Clipboard API (Chrome, Firefox 22+)
    if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {
            
        // Check for 'text/html' in types list. See abligh's answer below for deatils on
        // why the DOMStringList bit is needed. We cannot fall back to 'text/plain' as
        // Safari/Edge don't advertise HTML data even if it is available
        types = e.clipboardData.types;
        if (((types instanceof DOMStringList) && types.contains("text/html")) || (types.indexOf && types.indexOf('text/html') !== -1)) {
        
            // Extract data and pass it to callback
            pastedData = e.clipboardData.getData('text/html');
            processPaste(editableDiv, pastedData);

            // Stop the data from actually being pasted
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
    
    // Everything else: Move existing element contents to a DocumentFragment for safekeeping
    savedContent = document.createDocumentFragment();
    while(editableDiv.childNodes.length > 0) {
        savedContent.appendChild(editableDiv.childNodes[0]);
    }
    
    // Then wait for browser to paste content into it and cleanup
    waitForPastedData(editableDiv, savedContent);
    return true;
}

function waitForPastedData (elem, savedContent) {

    // If data has been processes by browser, process it
    if (elem.childNodes && elem.childNodes.length > 0) {
    
        // Retrieve pasted content via innerHTML
        // (Alternatively loop through elem.childNodes or elem.getElementsByTagName here)
        var pastedData = elem.innerHTML;
        
        // Restore saved content
        elem.innerHTML = "";
        elem.appendChild(savedContent);
        
        // Call callback
        processPaste(elem, pastedData);
    }
    
    // Else wait 20ms and try again
    else {
        setTimeout(function () {
            waitForPastedData(elem, savedContent)
        }, 20);
    }
}

function processPaste (elem, pastedData) {
  // Do whatever with gathered data;
  console.log(pastedData)
  var result = htmlToElement(pastedData);
  console.log(result);
  console.log(result.src);
  elem.focus();
}

editableDiv.addEventListener('paste', handlepaste, false);

//document.onpaste = function(pasteEvent) {
//
//  console.log('HERE!!!');
//  console.log(pasteEvent);
//
//  // consider the first item (can be easily extended for multiple items)
//  var item = pasteEvent.clipboardData.items[0];
//  
//  console.log(item);
// 
//  if (item.kind == 'string' && item.type.indexOf("image") === 0) {
//    var blob = item.getAsFile();
// 
//    var reader = new FileReader();
//    reader.onload = function(event) {
//      document.getElementById("container").src = event.target.result;
//    };
// 
//    reader.readAsDataURL(blob);
//  } else if (item.kind == 'string' && item.type.match('^text/html')) {
//    // Drag data item is HTML
//    console.log("... Drop: HTML");
//    var data = pasteEvent.getData("text");
//    console.log(data);
//  }
//}

// ---------------------------------------------------------------------------------------

//document.addEventListener('paste', (event) => {
//  let paste = (event.clipboardData || window.clipboardData).getData('text');
//  console.log(event.clipboardData);
//  console.log(paste);
//
//  //const selection = window.getSelection();
//  //if (!selection.rangeCount) return false;
//  //selection.deleteFromDocument();
//  //selection.getRangeAt(0).insertNode(document.createTextNode(paste));
//
//  event.preventDefault();
//});
