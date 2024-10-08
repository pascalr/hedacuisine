class RecipeNote < ApplicationRecord
  belongs_to :recipe

  acts_as_list column: "item_nb", scope: :recipe

  def content
    raise "deprecated, use json and html"
  end
  
  def to_obj(params={})
    extract_attributes(params, :item_nb)
  end
end
