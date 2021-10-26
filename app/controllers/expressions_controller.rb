class ExpressionsController < ApplicationController
  before_action :set_expression, only: %i[ show edit update destroy ]
  #skip_before_action :authenticate_user!, only: [:show]

  def index
    @expressions = Expression.all.includes(:french_expression).order(:default)
  end

  def show
  end

  def create
    @expression = Expression.new(expression_params)
    @expression.save!
    redirect_to expressions_path
  end

  def update
    @expression.update!(expression_params)
    redirect_to expressions_path
  end

  def destroy
    @expression.destroy
    redirect_to expressions_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_expression
      @expression = Expression.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def expression_params
      params.require(:expression).permit(:default, french_expression_attributes: [:id, :singular, :plural, :contract_preposition])
    end
end
