class ImagesController < ApplicationController

  #include ActiveStorage::SetCurrent # For images path. (thumb, small, medium, original, ...)
  include ActiveStorage::FileServer # For serve_file method

  #skip_before_action :authenticate_user!, only: [:show]
  #skip_before_action :only_admin!, only: [ :show]
  before_action :set_image, only: [:show, :update, :destroy, :edit, :process_image, :small, :medium, :thumb, :original, :portrait_thumb, :small_book, :book]
  skip_before_action :authenticate_user!, only: [:thumb, :medium, :small, :original, :portrait_thumb, :small_book, :book]
  skip_before_action :only_admin!, only: [:thumb, :medium, :small, :original, :portrait_thumb, :small_book, :book]

  #around_filter :silence_action, :only => :action
  #def silence_action
  #  Rails.logger.silence do
  #    yield
  #  end
  #end

  def index
    @images = Image.order(id: :desc).all
  end

  def send_image(variant)
    redirect_to variant

    #current_service = ActiveStorage::Blob.service.name
    ##named_disk_service = ActiveStorage::Blob.services.fetch(variant.blob.service_name) do
    #named_disk_service = ActiveStorage::Blob.services.fetch(current_service) do
    #  ActiveStorage::Blob.service
    #end
    #variant.processed # Make sure the variant exists
    #serve_file named_disk_service.path_for(variant.key), content_type: variant.content_type, disposition: "attachment"
  end
  def original
    send_image @image.original
  end
  def thumb
    send_image @image.thumb_variant
  end
  def small
    send_image @image.small_variant
  end
  def medium
    send_image @image.medium_variant
  end
  def portrait_thumb
    send_image @image.portrait_thumb_variant
  end
  def small_book
    send_image @image.small_book_variant
  end
  def book
    send_image @image.book_variant
  end

  def show
  end

  def edit
  end

  def new
    @image = Image.new
  end

  def process_image
    #process_variants(@image)
    #@image.save!
  end

  def create
    image = Image.new(image_params)
    #process_variants(image)
    image.save!
    respond_to do |format|
      format.json { render json: to_obj(image) }
      format.html {redirect_back fallback_location: image_path(image)}
    end
  end

  def update
    @image.update!(image_params)
    respond_to do |format|
      format.json { render json: to_obj(@image) }
      format.html { redirect_back fallback_location: image_path(@image) }
    end
  end

  def destroy
    @image.destroy!
    redirect_back fallback_location: images_path
  end

private

  def process_variants(image)
    #debugger
    ##im = MiniMagick::Image.open(image_params[:original])
    ##im.resize("71x")
    ##im.crop("71X48+0+#{((image.height-48)/2.0).to_i}")
    ##Piet.optimize(im.to_path)
    ##processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize_to_limit(71,48).call
    ##processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize("71x").crop("71X48+0+#{((image.height-48)/2.0).to_i}").call
    #processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize("71x").call
    #debugger
    #image.thumb.attach(io: processed, filename: File.basename(processed.path))

    #processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize_to_limit(255,171).call
    #image.small.attach(io: processed, filename: File.basename(processed.path))

    #processed = ImageProcessing::MiniMagick.source(image_params[:original]).resize_to_limit(452,304).call
    #image.medium.attach(io: processed, filename: File.basename(processed.path))
  end
  
  def set_image
    @image = Image.includes(:original_attachment).find(params[:id])
  end
    
  def image_params
    params.require(:image).permit(:filename, :zoom, :left, :top, :original, :thumb, :small, :medium, :author, :source, :description, :is_user_author)
  end
end
