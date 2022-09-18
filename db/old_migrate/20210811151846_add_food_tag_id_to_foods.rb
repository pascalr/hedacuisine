class AddFoodTagIdToFoods < ActiveRecord::Migration[6.0]
  def change
    add_column :foods, :food_tag_id, :integer
  end
end
