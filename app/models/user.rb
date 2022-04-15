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
  has_many :books
  has_many :suggestions
  has_many :recipe_filters

  has_many :machine_users
  has_many :machines, through: :machine_users

  belongs_to :account

  def siblings
    account ? account.users - [self] : [] # tmp, account should never be null
  end
end
