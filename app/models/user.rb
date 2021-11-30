class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  #devise :database_authenticatable, :registerable,
  #       :recoverable, :rememberable, :validatable
  
  # NOTE: In order to create a user. Uncomment registerable. Edit config/initializers/devise..., comment
  # config.scoped_views = true
  # run $ rails restart
  # At some point when I allow the creation of users

  devise :database_authenticatable#, :registerable
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

  has_many :user_recipes
  has_many :user_recipe_categories

  has_many :siblings_1, class_name: 'UserSibling', foreign_key: 'user_id'
  has_many :siblings_2, class_name: 'UserSibling', foreign_key: 'sibling_id'
  def siblings
    siblings_1.map(&:sibling) + siblings_2.map(&:user)
  end
end
