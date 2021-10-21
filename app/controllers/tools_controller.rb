class ToolsController < ApplicationController
  before_action :set_tool, only: %i[ show edit update destroy ]
  skip_before_action :authenticate_user!, only: [:show]
  skip_before_action :only_admin!, only: [:show]

  def show
  end
  
  def edit
  end

  def index
    @tools = Tool.all.order(:name)
  end

  def create
    @tool = Tool.new(tool_params)
    @tool.save!
    redirect_to tools_path
  end

  def update
    @tool.update!(tool_params)
    redirect_to tools_path
  end

  def destroy
    @tool.destroy
    redirect_to tools_path
  end

  private
    def set_tool
      @tool = Tool.find(params[:id])
      #@tool = Tool.find(params[:slug].split('-')[0])
    end

    def tool_params
      params.require(:tool).permit(:name)
    end
end
