class AddExpressionIdToFoods < ActiveRecord::Migration[6.1]
  def change
    add_column :foods, :expression_id, :integer
  end
end
