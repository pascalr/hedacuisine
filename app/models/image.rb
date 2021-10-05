class Image < ApplicationRecord
  has_one_attached :original
  has_one_attached :thumb
  has_one_attached :small
  has_one_attached :medium
end
