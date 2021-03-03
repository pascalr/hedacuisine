require 'test_helper'

class UnitSystemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @unit_system = unit_systems(:one)
  end

  test "should get index" do
    get unit_systems_url
    assert_response :success
  end

  test "should get new" do
    get new_unit_system_url
    assert_response :success
  end

  test "should create unit_system" do
    assert_difference('UnitSystem.count') do
      post unit_systems_url, params: { unit_system: {  } }
    end

    assert_redirected_to unit_system_url(UnitSystem.last)
  end

  test "should show unit_system" do
    get unit_system_url(@unit_system)
    assert_response :success
  end

  test "should get edit" do
    get edit_unit_system_url(@unit_system)
    assert_response :success
  end

  test "should update unit_system" do
    patch unit_system_url(@unit_system), params: { unit_system: {  } }
    assert_redirected_to unit_system_url(@unit_system)
  end

  test "should destroy unit_system" do
    assert_difference('UnitSystem.count', -1) do
      delete unit_system_url(@unit_system)
    end

    assert_redirected_to unit_systems_url
  end
end
