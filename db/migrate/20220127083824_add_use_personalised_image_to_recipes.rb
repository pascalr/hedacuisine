class AddUsePersonalisedImageToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :use_personalised_image, :boolean
  end
end
