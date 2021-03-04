class FoodPreferencesController < ApplicationController
  before_action :set_food_preference, only: %i[ update destroy ]
  skip_before_action :only_admin!

  def index
  end

  def create
    @food_preference = FoodPreference.new(food_preference_params)
    @food_preference.user = current_user
    @food_preference.save!
    redirect_to food_preferences_path
  end

  def update
    @food_preference.update!(food_preference_params)
    redirect_to food_preferences_path
  end

  def destroy
    @food_preference.destroy
    redirect_to food_preferences_path
  end

  private
    def set_food_preference
      @food_preference = current_user.food_preferences.find(params[:id])
    end

    def food_preference_params
      params.require(:food_preference).permit(:food_id, :preference, :availability)
    end
end
