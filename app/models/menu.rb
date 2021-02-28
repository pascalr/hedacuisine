class Menu < ApplicationRecord
  belongs_to :user, optional: true
  has_many :categories
  has_many :favorite_menus
  def recipes
    categories.map(&:recipes).flatten
  end
  def is_user_favorite(user)
    return false unless user
    favorite_menus.each {|m| return true if m.user_id == user.id }
    false
  end
end
