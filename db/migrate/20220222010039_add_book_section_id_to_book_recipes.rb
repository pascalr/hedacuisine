class AddBookSectionIdToBookRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :book_recipes, :book_section_id, :integer
  end
end
