class SimController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!

  def get_state
    render json: {recipes: Recipe.where.not(instructions: [nil, ""])}
  end

  def pull_state
    render json: {current_user: current_user ? current_user.email : "none"}
  end
end
