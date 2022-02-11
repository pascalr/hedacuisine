class AddBeforeRecipeAtToBookSections < ActiveRecord::Migration[6.1]
  def change
    add_column :book_sections, :before_recipe_at, :integer
    remove_column :book_sections, :position
  end
end
