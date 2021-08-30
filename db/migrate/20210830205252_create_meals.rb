class CreateMeals < ActiveRecord::Migration[6.0]
  def change
    create_table :meals do |t|
      t.references :machine, null: false, foreign_key: true
      t.references :recipe, null: false, foreign_key: true
      t.datetime :start_time
      t.datetime :end_time
      t.boolean :is_done

      t.timestamps
    end
  end
end
