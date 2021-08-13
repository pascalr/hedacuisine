class CreateWeighings < ActiveRecord::Migration[6.0]
  def change
    create_table :weighings do |t|
      t.references :machine, null: false, foreign_key: true
      t.references :food, null: false, foreign_key: true
      t.float :weight

      t.timestamps
    end
  end
end
