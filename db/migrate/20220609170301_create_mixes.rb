class CreateMixes < ActiveRecord::Migration[7.0]
  def change
    create_table :mixes do |t|
      t.string :name
      t.string :instructions
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
