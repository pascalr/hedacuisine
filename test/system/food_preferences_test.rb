require "application_system_test_case"

class FoodPreferencesTest < ApplicationSystemTestCase
  setup do
    @food_preference = food_preferences(:one)
  end

  test "visiting the index" do
    visit food_preferences_url
    assert_selector "h1", text: "Food Preferences"
  end

  test "creating a Food preference" do
    visit food_preferences_url
    click_on "New Food Preference"

    fill_in "Availability", with: @food_preference.availability
    fill_in "Food", with: @food_preference.food_id
    fill_in "Preference", with: @food_preference.preference
    fill_in "User", with: @food_preference.user_id
    click_on "Create Food preference"

    assert_text "Food preference was successfully created"
    click_on "Back"
  end

  test "updating a Food preference" do
    visit food_preferences_url
    click_on "Edit", match: :first

    fill_in "Availability", with: @food_preference.availability
    fill_in "Food", with: @food_preference.food_id
    fill_in "Preference", with: @food_preference.preference
    fill_in "User", with: @food_preference.user_id
    click_on "Update Food preference"

    assert_text "Food preference was successfully updated"
    click_on "Back"
  end

  test "destroying a Food preference" do
    visit food_preferences_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Food preference was successfully destroyed"
  end
end
