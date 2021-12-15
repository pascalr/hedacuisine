import React, { useState, useEffect, useRef } from 'react'

import { colorToHexString, hexStringToColor, Utils } from 'utils'

export const themeCssClass = (theme) => {
  return "theme-"+theme.name.toLowerCase().replace(/ /, '-')
}

// NOTE: Also modify /app/views/themes/_stylesheet.html.erb
export const Theme = ({theme}) => {
  const themeClass = themeCssClass(theme)
  return (
    <style>{`
      .${themeClass} h1, .${themeClass} h2, .${themeClass} h3, .${themeClass} h4, .${themeClass} h5, .${themeClass} h6, .${themeClass} p, .${themeClass} .author, .${themeClass} li {
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
    `}</style>
  )
}
