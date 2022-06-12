class AddOriginalRecipeIdAndRecipeIdToMixes < ActiveRecord::Migration[7.0]
  def change
    add_column :mixes, :original_recipe_id, :integer
    add_column :mixes, :recipe_id, :integer
  end
end
