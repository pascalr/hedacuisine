import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import {RecipeIndex} from './recipe_index'

document.addEventListener('DOMContentLoaded', () => {

  const root = document.getElementById('root')
  if (root) {ReactDOM.render(<RecipeIndex userRecipes={gon.recipes} />, root)}
})
