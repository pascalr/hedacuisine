class UserTag < ApplicationRecord
  belongs_to :user
  belongs_to :tag, class_name: 'RecipeFilter'
  
  acts_as_list scope: :user # from gem acts_as_list

  validates :tag_id, uniqueness: { scope: :user_id }

  def to_obj(params={})
    extract_attributes(params, :tag_id, :position)
  end
end
