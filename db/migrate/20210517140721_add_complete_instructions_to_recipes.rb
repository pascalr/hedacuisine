class AddCompleteInstructionsToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :complete_instructions, :text
  end
end
