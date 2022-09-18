class CreateUserSiblings < ActiveRecord::Migration[6.1]
  def change
    create_table :user_siblings do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :sibling_id, null: false, foreign_key: true

      t.timestamps
    end
  end
end
