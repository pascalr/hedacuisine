import React, { useState, useEffect, useRef } from 'react'

import { colorToHexString, hexStringToColor, Utils } from 'utils'

export const themeCssClass = (theme) => {
  return "theme-"+theme.name.toLowerCase().replace(/ /, '-')
}

// NOTE: Also modify /app/views/themes/_stylesheet.html.erb
// Regular get regular color and regular background color.
// Style2 get color2 and background-color2
// Style3 get color3 and background-color3
export const Theme = ({theme}) => {
  const themeClass = themeCssClass(theme)
      //.${themeClass} h1, .${themeClass} h2, .${themeClass} h3, .${themeClass} h4, .${themeClass} h5, .${themeClass} h6, .${themeClass} p, .${themeClass} .author, .${themeClass} li {
      //  color: ${colorToHexString(theme.text_color)};
      //}
//.<%= theme.css_class %> h1, .<%= theme.css_class %> h2, .<%= theme.css_class %> h3, .<%= theme.css_class %> h4, .<%= theme.css_class %> h5, .<%= theme.css_class %> h6, .<%= theme.css_class %> p, .<%= theme.css_class %> .author, .<%= theme.css_class %> li {

  //background-size: 100% 100%;
  return (
    <style>{`
      .${themeClass} * {
        color: ${colorToHexString(theme.text_color)};
      }
      .${themeClass} .page {
        background-color: ${colorToHexString(theme.background_color)};
      }
      .${themeClass} .page + .page {
        border-top: 4px solid ${colorToHexString(theme.page_separator_color)};
      }
      .${themeClass} .index-page a, .theme-light .title-page a {
        color: ${colorToHexString(theme.text_color)}
      }
      .${themeClass} .index-page a:hover {
        color: #444;
      }
      ${!theme.front_page_image ? '' : `
        .${themeClass} .title-page {
          background-size: cover;
          background-image: url("${theme.front_page_image.url}");
        }
      `}
    `}</style>
  )
}
