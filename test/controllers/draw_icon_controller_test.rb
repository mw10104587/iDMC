require 'test_helper'

class DrawIconControllerTest < ActionController::TestCase
  test "should get draw" do
    get :draw
    assert_response :success
  end

end
