require "application_system_test_case"

class UnitsTest < ApplicationSystemTestCase
  setup do
    @unit = units(:one)
  end

  test "visiting the index" do
    visit units_url
    assert_selector "h1", text: "Units"
  end

  test "creating a Unit" do
    visit units_url
    click_on "New Unit"

    check "Is volume" if @unit.is_volume
    check "Is weight" if @unit.is_weight
    fill_in "Language", with: @unit.language_id
    fill_in "Name", with: @unit.name
    check "Show fraction" if @unit.show_fraction
    fill_in "Value", with: @unit.value
    click_on "Create Unit"

    assert_text "Unit was successfully created"
    click_on "Back"
  end

  test "updating a Unit" do
    visit units_url
    click_on "Edit", match: :first

    check "Is volume" if @unit.is_volume
    check "Is weight" if @unit.is_weight
    fill_in "Language", with: @unit.language_id
    fill_in "Name", with: @unit.name
    check "Show fraction" if @unit.show_fraction
    fill_in "Value", with: @unit.value
    click_on "Update Unit"

    assert_text "Unit was successfully updated"
    click_on "Back"
  end

  test "destroying a Unit" do
    visit units_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Unit was successfully destroyed"
  end
end
