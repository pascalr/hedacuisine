require "application_system_test_case"

class UnitSystemsTest < ApplicationSystemTestCase
  setup do
    @unit_system = unit_systems(:one)
  end

  test "visiting the index" do
    visit unit_systems_url
    assert_selector "h1", text: "Unit Systems"
  end

  test "creating a Unit system" do
    visit unit_systems_url
    click_on "New Unit System"

    click_on "Create Unit system"

    assert_text "Unit system was successfully created"
    click_on "Back"
  end

  test "updating a Unit system" do
    visit unit_systems_url
    click_on "Edit", match: :first

    click_on "Update Unit system"

    assert_text "Unit system was successfully updated"
    click_on "Back"
  end

  test "destroying a Unit system" do
    visit unit_systems_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Unit system was successfully destroyed"
  end
end
