class ImagesController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:show]
  #skip_before_action :only_admin!, only: [ :show]
  before_action :set_image, only: [:show, :update, :destroy, :edit, :process_image]

  def index
    @images = Image.all
  end

  def show
  end

  def edit
  end

  def new
    @image = Image.new
  end

  def process_image
    process_variants(@image)
    @image.save!
  end

  def create
    image = Image.new(image_params)
    process_variants(image)
    image.save!
    redirect_back fallback_location: image_path(image)
  end

  def update
    @image.update!(image_params)
    redirect_back fallback_location: image_path(@image)
  end

  def destroy
    @image.destroy!
    redirect_back fallback_location: images_path
  end

private

  def process_variants(image)
    debugger
    #im = MiniMagick::Image.open(image_params[:original])
    #im.resize("71x")
    #im.crop("71X48+0+#{((image.height-48)/2.0).to_i}")
    #Piet.optimize(im.to_path)
    #processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize_to_limit(71,48).call
    #processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize("71x").crop("71X48+0+#{((image.height-48)/2.0).to_i}").call
    processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize("71x").call
    debugger
    image.thumb.attach(io: processed, filename: File.basename(processed.path))

    processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize_to_limit(255,171).call
    image.small.attach(io: processed, filename: File.basename(processed.path))

    processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize_to_limit(452,304).call
    image.medium.attach(io: processed, filename: File.basename(processed.path))
  end
  
  def set_image
    @image = Image.find(params[:id])
  end
    
  def image_params
    params.require(:image).permit(:filename, :zoom, :left, :top, :original, :thumb, :small, :medium)
  end
end
