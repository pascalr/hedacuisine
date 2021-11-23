class AddKindIdToRecipeKinds < ActiveRecord::Migration[6.1]
  def change
    add_column :recipe_kinds, :kind_id, :integer
  end
end
