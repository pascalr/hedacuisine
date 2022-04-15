class ImagesController < ApplicationController

  #include ActiveStorage::SetCurrent # For images path. (thumb, small, medium, original, ...)
  #include ActiveStorage::FileServer # For serve_file method

  before_action :set_image, only: [:show, :update, :destroy, :edit, :process_image, :variant]
  skip_before_action :authenticate_account!, only: [:variant]
  skip_before_action :only_admin!, only: [:variant]

  #around_filter :silence_action, :only => :variant
  #def silence_action
  #  Rails.logger.silence do
  #    yield
  #  end
  #end

  def index
    @images = Image.order(id: :desc).all
  end

  def public_images
    path = Rails.root.join('public/img/').to_s
    files = Dir.glob(path+'*')
    render json: files.map {|f| f[path.length..-1]}
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
  def variant
    send_image @image.variant(params[:variant])
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
