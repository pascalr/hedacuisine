module SerializeHelper

  def extract_attributes(record, *attributes)
    attributes.inject({}) {|extracted, attr| extracted[attr] = record.send(attr); extracted}
  end

  def collection_by_id(records, &block)
    records.inject({}) {|objs_by_id, record| objs_by_id[record.id] = yield(record); objs_by_id}
  end

  def to_obj(record)
    return nil if record.nil?
    return recipe_to_obj(record) if record.is_a? Recipe
    return image_to_obj(record) if record.is_a? Image
    return food_to_obj(record) if record.is_a? Food
    return ingredient_section_to_obj(record) if record.is_a? IngredientSection
  end

  def image_to_obj(image)
    obj = extract_attributes(image, :id, :author, :source, :filename)
    obj.merge!({
      class_name: "image",
      url: image_path(image),
      path: image_variant_path(image, :medium),
      is_user_author: !!image.is_user_author
    })
    obj
  end

  def recipe_kind_to_obj(recipe_kind)
    obj = {}
    obj[:path] = image_variant_path(recipe_kind.image, :medium)
    obj
  end

  def ingredient_section_to_obj(section)
    obj = extract_attributes(section, :before_ing_nb, :name)
    obj
  end

  def recipe_to_obj(recipe)
    obj = extract_attributes(recipe, :id, :name, :recipe_kind_id, :main_ingredient_id, :preparation_time, :cooking_time, :total_time, :raw_servings, :json)
    obj.merge!({
      class_name: "recipe",
      url: recipe_path(recipe),
      new_ingredient_url: recipe_recipe_ingredients_path(recipe),
      new_note_url: recipe_recipe_notes_path(recipe),
      new_ingredient_section_url: recipe_ingredient_sections_path(recipe),
      move_ing_url: move_ing_recipe_path(recipe),
      use_personalised_image: !!recipe.use_personalised_image,
      notes: collection_by_id(recipe.notes.order(:item_nb)) { |note|
        recipe_note_to_obj(note)
      },
      ingredients: collection_by_id(recipe.ingredients.order(:item_nb)) { |note|
        recipe_ingredient_to_obj(recipe, note)
      },
      tools: collection_by_id(recipe.tools) { |tool|
        tool_to_obj(tool)
      },
      ingredient_sections: recipe.ingredient_sections.map {|s| ingredient_section_to_obj(s)},
    })
    obj
  end

  def ingredient_section_to_obj(section)
    obj = extract_attributes(section, :id, :name, :before_ing_nb)
    obj.merge!({
      class_name: "ingredient_section",
      url: recipe_ingredient_section_path(section.recipe, section)
    })
    obj
  end

  def tool_to_obj(tool)
    obj = extract_attributes(tool, :name)
    obj
  end

  def recipe_note_to_obj(note)
    obj = extract_attributes(note, :id, :item_nb, :html, :json)
    obj.merge!({
      class_name: "recipe_note",
      url: recipe_recipe_note_path(note.recipe, note)
    })
    obj
  end

  def recipe_ingredient_to_obj(recipe, ing)
    obj = extract_attributes(ing, :id, :name, :item_nb, :raw, :comment_json)
    obj.merge!({
      class_name: "recipe_ingredient",
      url: recipe_recipe_ingredient_path(recipe, ing)
    })
    if ing.food
      obj[:food] = food_to_obj(ing.food)
    end
    obj
  end

  def food_to_obj(food)
    obj = extract_attributes(food, :id, :name)
    obj[:url] = food_path(food)
    obj
  end
end
