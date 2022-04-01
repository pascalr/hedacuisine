import React, { useState, useEffect, useRef } from 'react'

import { isBlank } from "../utils"

export const PercentageCompleted = ({recipe}) => {

  let percent = 0
  if (!isBlank(recipe.ingredients)) {percent += 30}
  if (!isBlank(recipe.json)) {percent += 30}
  if (recipe.cooking_time || recipe.preparation_time || recipe.total_time) {percent += 15}
  if (recipe.raw_servings) {percent += 15}
  if (recipe.main_ingredient_id) {percent += 10}

  return (<>
    <span>{percent}%</span>
  </>)
}
