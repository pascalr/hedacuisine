class Mix < ApplicationRecord
  belongs_to :user

  def to_obj(params={})
    extract_attributes(params, :name, :instructions)
  end
end
