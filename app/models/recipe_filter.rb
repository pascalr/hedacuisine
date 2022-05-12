class RecipeFilter < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :image, optional: true

  has_many :filtered_recipes
 
  # A tag can have the same name as a global one (user_id==nil).
  # Run a task periodically to remove tags with the name the same as global one and link to it. 
  validates :name, uniqueness: { scope: :user_id }

  def to_obj(params={})
    extract_attributes(params, :name, :image_src, :user_id)
  end
end
