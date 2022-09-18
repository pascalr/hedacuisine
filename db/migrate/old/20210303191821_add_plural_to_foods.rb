class AddPluralToFoods < ActiveRecord::Migration[6.0]
  def change
    add_column :foods, :plural, :string
  end
end
