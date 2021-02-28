class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :menus
  has_many :raw_favorite_menus, class_name: 'FavoriteMenu'
  has_many :favorite_menus, through: 'raw_favorite_menus', source: 'menu'
  has_many :recipe_ratings
  has_many :recipe_comments
end
