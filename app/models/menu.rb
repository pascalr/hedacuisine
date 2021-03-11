class Menu < ApplicationRecord
  belongs_to :user, optional: true
  has_many :categories
  has_many :items
  has_many :favorite_menus
  has_many :descriptions, as: :described
  belongs_to :parent, class_name: "Menu", optional: true
  has_many :children, class_name: "Menu", foreign_key: 'parent_id'

  def recipes
    categories.map(&:recipes).flatten
  end
  def is_user_favorite(user)
    return false unless user
    favorite_menus.each {|m| return true if m.user_id == user.id }
    false
  end
end
