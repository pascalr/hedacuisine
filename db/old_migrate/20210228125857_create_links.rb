class CreateLinks < ActiveRecord::Migration[6.0]
  def change
    create_table :recipes do |t|
      t.string :name
      t.string :source

      t.timestamps
    end
  end
end
