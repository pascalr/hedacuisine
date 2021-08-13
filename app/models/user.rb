class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  #devise :database_authenticatable, :registerable,
  #       :recoverable, :rememberable, :validatable
  devise :database_authenticatable#, :registerable,
  #       :recoverable, :rememberable, :validatable

  has_many :menus
  has_many :recipes
  has_many :raw_favorite_menus, class_name: 'FavoriteMenu'
  has_many :favorite_menus, through: 'raw_favorite_menus', source: 'menu'
  has_many :recipe_ratings
  has_many :recipe_comments
  has_many :food_preferences

  has_many :machine_users
  has_many :machines, through: :machine_users
end
