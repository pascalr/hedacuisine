class FavoriteMenu < ApplicationRecord
  belongs_to :menu
  belongs_to :user
end
