require "application_system_test_case"

class ContainerFormatsTest < ApplicationSystemTestCase
  setup do
    @container_format = container_formats(:one)
  end

  test "visiting the index" do
    visit container_formats_url
    assert_selector "h1", text: "Container Formats"
  end

  test "creating a Container format" do
    visit container_formats_url
    click_on "New Container Format"

    fill_in "Name", with: @container_format.name
    click_on "Create Container format"

    assert_text "Container format was successfully created"
    click_on "Back"
  end

  test "updating a Container format" do
    visit container_formats_url
    click_on "Edit", match: :first

    fill_in "Name", with: @container_format.name
    click_on "Update Container format"

    assert_text "Container format was successfully updated"
    click_on "Back"
  end

  test "destroying a Container format" do
    visit container_formats_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Container format was successfully destroyed"
  end
end
