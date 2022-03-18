module SerializeHelper

  def extract_attributes(record, *attributes)
    obj = attributes.inject({}) {|extracted, attr| extracted[attr] = record.send(attr); extracted}
    obj[:class_name] = record.class.name.underscore
    obj[:id] = record.id
    obj
  end

  def collection_by_id(records, &block)
    records.inject({}) {|objs_by_id, record| objs_by_id[record.id] = (block_given? ? yield(record) : to_obj(record)); objs_by_id}
  end
  
  def __to_obj(record)
    return nil if record.nil?
    return record.map {|r| to_obj(r) } if record.is_a? Array
    return recipe_to_obj(record) if record.is_a? Recipe
    return image_to_obj(record) if record.is_a? Image
    return food_to_obj(record) if record.is_a? Food
    return recipe_note_to_obj(record) if record.is_a? RecipeNote
    return recipe_kind_to_obj(record) if record.is_a? RecipeKind
    return ingredient_section_to_obj(record) if record.is_a? IngredientSection
    return recipe_ingredient_to_obj(record) if record.is_a? RecipeIngredient
    return book_section_to_obj(record) if record.is_a? BookSection
    return book_recipe_to_obj(record) if record.is_a? BookRecipe
    return book_to_obj(record) if record.is_a? Book
    return tool_to_obj(record) if tool.is_a? Tool
    raise "Can't convert to_obj. Unkown type for record #{record}"
  end

  # You can pass to_obj(record, includes: :nested). Only this form is supported for now until I need more
  def to_obj(record, params={})
    obj = __to_obj(record)
    if params[:includes]
      # TODO: Handle more cases (hash for nested, list for many, ...)
      # TODO: Make sure the association exists and avoid send?
      assoc = params[:includes].to_sym
      obj[assoc] = to_obj(record.send(assoc))
    end
    obj
  end

  def book_to_obj(book)
    obj = extract_attributes(book, :name, :author, :description_json)
    obj[:url] = book_path(book)
    obj[:new_book_section_url] = book_book_sections_path(book)
    obj[:new_book_recipe_url] = move_book_recipe_book_path(book)
    obj[:image] = to_obj(book.image)
    obj[:url] = book_path(book)
    obj
  end

  def book_recipe_to_obj(book_recipe)
    obj = book_recipe.to_obj
    obj = extract_attributes(book_recipe, :position, :book_section_id)
    obj[:url] = book_book_recipe_path(book_recipe.book, book_recipe)
    obj[:recipe] = {
      id: book_recipe.recipe.id,
      name: book_recipe.recipe.name
    }
    obj
  end

  def book_section_to_obj(book_section)
    obj = extract_attributes(book_section, :name, :before_recipe_at, :position)
    obj[:url] = book_book_section_path(book_section.book, book_section)
    obj
  end

  def image_to_obj(image)
    obj = extract_attributes(image, :author, :source, :filename)
    obj.merge!({
      url: image_path(image),
      variants: {
        thumb: image_variant_path(image, :thumb),
        portrait_thumb: image_variant_path(image, :portrait_thumb),
        small: image_variant_path(image, :small),
        medium: image_variant_path(image, :medium),
        small_book: image_variant_path(image, :small_book),
      },
      path: image_variant_path(image, :medium), # DEPRECATED, use variants
      is_user_author: !!image.is_user_author
    })
    obj
  end

  def recipe_kind_to_obj(recipe_kind)
    obj = extract_attributes(recipe_kind, :name, :description_json)
    obj[:image] = to_obj(recipe_kind.image)
    obj[:url] = recipe_kind_path(recipe_kind)
    obj
  end

  def ingredient_section_to_obj(section)
    obj = extract_attributes(section, :before_ing_nb, :name)
    obj
  end

  def recipe_to_obj(recipe)
    obj = recipe.to_obj
    obj.merge!({
      url: recipe_path(recipe),
      new_ingredient_url: recipe_recipe_ingredients_path(recipe),
      new_note_url: recipe_recipe_notes_path(recipe),
      new_ingredient_section_url: recipe_ingredient_sections_path(recipe),
      move_ing_url: move_ing_recipe_path(recipe),
      use_personalised_image: !!recipe.use_personalised_image,
      notes: collection_by_id(recipe.notes.order(:item_nb)) { |note|
        recipe_note_to_obj(note) # OPTIMIZE: I believe this block is not necessary anymore. Default is to_obj and should work.
      },
      ingredients: recipe.ingredients.order(:item_nb).map {|s| recipe_ingredient_to_obj(s)},
      #ingredients: collection_by_id(recipe.ingredients.order(:item_nb)) { |note|
      #  recipe_ingredient_to_obj(recipe, note)
      #},
      tools: collection_by_id(recipe.tools) { |tool|
        tool_to_obj(tool) # OPTIMIZE: I believe this block is not necessary anymore. Default is to_obj and should work.
      },
      ingredient_sections: recipe.ingredient_sections.map {|s| ingredient_section_to_obj(s)},
    })
    obj
  end

  def ingredient_section_to_obj(section)
    obj = section.to_obj
    obj.merge!({
      url: recipe_ingredient_section_path(section.recipe, section)
    })
    obj
  end

  def tool_to_obj(tool)
    obj = extract_attributes(tool, :name)
    obj
  end

  def recipe_note_to_obj(note)
    obj = extract_attributes(note, :item_nb, :html, :json)
    obj.merge!({
      url: recipe_recipe_note_path(note.recipe, note)
    })
    obj
  end

  def recipe_ingredient_to_obj(ing)
    obj = ing.to_obj
    obj.merge!({
      url: recipe_recipe_ingredient_path(ing.recipe, ing)
    })
    if ing.food
      obj[:food] = food_to_obj(ing.food)
    end
    obj
  end

  def food_to_obj(food)
    obj = food.to_obj
    obj[:url] = food_path(food)
    obj
  end
end
