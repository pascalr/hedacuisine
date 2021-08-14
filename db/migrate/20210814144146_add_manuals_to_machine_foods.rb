class AddManualsToMachineFoods < ActiveRecord::Migration[6.0]
  def change
    add_column :machine_foods, :manual_grocery_threshold, :string
    add_column :machine_foods, :manual_full_weight, :string
  end
end
