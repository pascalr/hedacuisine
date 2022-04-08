class AddImageSrcToRecipeFilters < ActiveRecord::Migration[7.0]
  def change
    add_column :recipe_filters, :image_src, :string
  end
end
