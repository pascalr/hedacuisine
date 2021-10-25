require 'ingredients_helper'

class IngredientsHelperTest < ActionView::TestCase
  test "pretty number" do
    assert_equal "130", pretty_number(132)
    assert_equal "130", pretty_number("132")
    assert_equal "130", pretty_number(126)
    assert_equal "1", pretty_number(1.0)
    assert_equal "1", pretty_number("1,0")
    assert_equal "1.1", pretty_number(1.1)
    assert_equal "1.1", pretty_number(1.12)
    assert_equal "0.5", pretty_number("1/2")
  end
end

