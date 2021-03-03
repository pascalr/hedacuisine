require 'test_helper'

class MetaControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get meta_index_url
    assert_response :success
  end

end
