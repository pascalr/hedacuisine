class CreateRegions < ActiveRecord::Migration[6.1]
  def change
    create_table :regions do |t|
      t.string :name
      t.string :code
      t.string :locale
      t.references :language, null: false, foreign_key: true

      t.timestamps
    end
  end
end
