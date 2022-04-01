class CreateSwipes < ActiveRecord::Migration[7.0]
  def change
    create_table :swipes do |t|
      t.boolean :is_positive
      t.references :suggestion, null: false, foreign_key: true
      t.integer :occasion_id

      t.timestamps
    end
  end
end
