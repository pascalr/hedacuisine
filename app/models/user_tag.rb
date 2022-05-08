class UserTag < ApplicationRecord
  belongs_to :user
  belongs_to :tag, class_name: 'RecipeFilter'

  validates :tag_id, uniqueness: { scope: :user_id }

  def to_obj(params={})
    extract_attributes(params, :tag_id)
  end
end
