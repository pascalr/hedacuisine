require 'ingredients_helper'

class IngredientsHelperTest < ActionView::TestCase
  test "pretty number" do
    assert_equal "130", pretty_number(132)
    assert_equal "130", pretty_number("132")
    assert_equal "130", pretty_number(126)
  end
end

