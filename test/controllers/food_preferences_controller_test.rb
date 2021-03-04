require 'test_helper'

class FoodPreferencesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @food_preference = food_preferences(:one)
  end

  test "should get index" do
    get food_preferences_url
    assert_response :success
  end

  test "should get new" do
    get new_food_preference_url
    assert_response :success
  end

  test "should create food_preference" do
    assert_difference('FoodPreference.count') do
      post food_preferences_url, params: { food_preference: { availability: @food_preference.availability, food_id: @food_preference.food_id, preference: @food_preference.preference, user_id: @food_preference.user_id } }
    end

    assert_redirected_to food_preference_url(FoodPreference.last)
  end

  test "should show food_preference" do
    get food_preference_url(@food_preference)
    assert_response :success
  end

  test "should get edit" do
    get edit_food_preference_url(@food_preference)
    assert_response :success
  end

  test "should update food_preference" do
    patch food_preference_url(@food_preference), params: { food_preference: { availability: @food_preference.availability, food_id: @food_preference.food_id, preference: @food_preference.preference, user_id: @food_preference.user_id } }
    assert_redirected_to food_preference_url(@food_preference)
  end

  test "should destroy food_preference" do
    assert_difference('FoodPreference.count', -1) do
      delete food_preference_url(@food_preference)
    end

    assert_redirected_to food_preferences_url
  end
end
