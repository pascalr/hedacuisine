// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

// Base code
//document.addEventListener("DOMContentLoaded", function(event) { 
//})

import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap
//import '../stylesheets/application'

import "chartkick/chart.js"
require("@rails/ujs").start()
//require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("jquery")
require("tiny-slider")
global.toastr = require("toastr")
global.toastr.options.closeButton = true;

window.Heda = {}
window.Heda.getLocale = function() { // TODO: RENAME TO getRegion
  return document.getElementById("region").innerHTML
};

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

import "controllers"
// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);

require("@rails/actiontext")
window.Trix = require("trix")
