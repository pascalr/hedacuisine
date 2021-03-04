class Recipe < ApplicationRecord
  has_many :ingredients
  has_many :foods, through: :ingredients
  belongs_to :user

  def to_param
    "#{id}-#{name}"
  end

  def missing_ingredients_for(user)
    #ingredients.filter {|i| user.food_preferences.in_stock.not.where(food_id: i.food_id).exists? }
    ingredients.select {|i|
      f = user.food_preferences.find_by(food_id: i.food_id)
      f.nil? || !f.in_stock?
    }
  end

end
