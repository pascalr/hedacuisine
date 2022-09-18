class AddRawQuantitiesToFoodSubstitutions < ActiveRecord::Migration[6.0]
  def change
    add_column :food_substitutions, :food_raw_quantity, :string
    add_column :food_substitutions, :substitute_raw_quantity, :string
  end
end
