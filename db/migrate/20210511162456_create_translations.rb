class CreateTranslations < ActiveRecord::Migration[6.0]
  def change
    connection.execute 'drop table if exists translations'
    create_table :translations do |t|
      t.integer :from
      t.integer :to
      t.string :original
      t.string :translated

      t.timestamps
    end
  end
end
