class CreateMissingTranslations < ActiveRecord::Migration[6.0]
  def change
    create_table :missing_translations do |t|
      t.string :content

      t.timestamps
    end
  end
end
