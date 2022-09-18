class AddFullWeightToMachineFoods < ActiveRecord::Migration[6.0]
  def change
    add_column :machine_foods, :full_weight, :float
  end
end
