class AddCurrentWeightToMachineFoods < ActiveRecord::Migration[6.0]
  def change
    add_column :machine_foods, :current_weight, :float
  end
end
