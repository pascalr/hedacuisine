require 'test_helper'

class ContainerFormatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @container_format = container_formats(:one)
  end

  test "should get index" do
    get container_formats_url
    assert_response :success
  end

  test "should get new" do
    get new_container_format_url
    assert_response :success
  end

  test "should create container_format" do
    assert_difference('ContainerFormat.count') do
      post container_formats_url, params: { container_format: { name: @container_format.name } }
    end

    assert_redirected_to container_format_url(ContainerFormat.last)
  end

  test "should show container_format" do
    get container_format_url(@container_format)
    assert_response :success
  end

  test "should get edit" do
    get edit_container_format_url(@container_format)
    assert_response :success
  end

  test "should update container_format" do
    patch container_format_url(@container_format), params: { container_format: { name: @container_format.name } }
    assert_redirected_to container_format_url(@container_format)
  end

  test "should destroy container_format" do
    assert_difference('ContainerFormat.count', -1) do
      delete container_format_url(@container_format)
    end

    assert_redirected_to container_formats_url
  end
end
