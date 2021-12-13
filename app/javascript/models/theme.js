import React, { useState, useEffect, useRef } from 'react'

import { colorToHexString, hexStringToColor, Utils } from 'utils'

export const themeCssClass = (theme) => {
  return "theme-"+theme.name.toLowerCase().replace(/ /, '-')
}

export const Theme = ({theme}) => {
  const themeClass = themeCssClass(theme)
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
    `}</style>
  )
}
