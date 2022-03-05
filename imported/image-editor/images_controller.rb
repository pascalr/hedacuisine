# image compression
# convert -resize 50% open-cupboard.jpg open-cupboard-resized.jpg
# convert open-cupboard-resized.jpg -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace RGB open-cupboard-resized.jpg

class ImagesController < ApplicationController
  before_action :set_image, only: %i[ show edit update destroy ]

  # GET /images or /images.json
  def index
    @images = Image.all
    @images.each do |image|
      create_thumbnail_if_not_exist(image)
    end
  end

  def export
    path = Rails.root.join("..").join("hedacuisine").join("public").join("images")
    Image.all.each do |image|
      unless path.join("#{image.id}_m.jpg").exist?
        analyze_image(image)
        process_medium_version(image, path.join("#{image.id}_m.jpg"))
        process_small_version(image, path.join("#{image.id}_s.jpg"))
        process_tiny_version(image, path.join("#{image.id}_t.jpg"))
      end
    end
    head :ok
  end

  def display
    name = params[:name].gsub(/[^0-9A-Za-z]/, '_') # sanitize for security
    send_file "#{Rails.root}/images/#{name}.jpg", type: "image/jpeg", disposition: 'inline'
  end

  # GET /images/1 or /images/1.json
  def show
    process_image(@image)
  end

  # GET /images/new
  def new
    @image = Image.new
  end

  # GET /images/1/edit
  def edit
    analyze_image(@image)
  end

  # POST /images or /images.json
  def create
    @image = Image.new(image_params)

    respond_to do |format|
      if @image.save
        format.html { redirect_to @image, notice: "Image was successfully created." }
        format.json { render :show, status: :created, location: @image }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @image.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /images/1 or /images/1.json
  def update
    respond_to do |format|
      if @image.update(image_params)
        format.html { redirect_to @image, notice: "Image was successfully updated." }
        format.json { render :show, status: :ok, location: @image }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @image.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /images/1 or /images/1.json
  def destroy
    @image.destroy
    respond_to do |format|
      format.html { redirect_to images_url, notice: "Image was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_image
      @image = Image.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def image_params
      params.require(:image).permit(:original_file, :top, :left, :zoom)
    end
    
    # Idéalement 452X304, avec le cellulaire c'est 405X304
    def process_medium_version(im, path)
      image = cropped_image(im)
      image.resize "452x"
      image.crop "452x304+0+#{((image.height-304)/2.0).to_i}"
      image.write(path)
      @medium_size = image.size
      @medium_height = image.height
      @medium_width = image.width
      Piet.optimize(path.to_path, :verbose => true)
      image = MiniMagick::Image.open(path)
      @medium_size_after = image.size
    end

    # Idéalement 255X171, avec le cellulaire c'est 228X171
    def process_small_version(im, path)
      image = cropped_image(im)
      image.resize "255x"
      image.crop "255X171+0+#{((image.height-171)/2.0).to_i}"
      image.write(path)
      Piet.optimize(path.to_path)
    end
    
    # Idéalement 71X48, avec le cellulaire c'est 64X48
    def process_tiny_version(im, path)
      image = cropped_image(im)
      image.resize "71x"
      image.crop "71X48+0+#{((image.height-48)/2.0).to_i}"
      image.write(path)
      Piet.optimize(path.to_path)
    end

    def analyze_image(im)
      image = MiniMagick::Image.open(Rails.root.join("images").join(im.original))
      im.width = image.width
      im.height = image.height
    end

    def cropped_image(image)
      return MiniMagick::Image.open(@cropped_path) if @cropped == image
      process_cropped(image)
    end

    def process_cropped(im)
      @cropped = im
      @cropped_path = Rails.root.join("public").join("preview").join("cropped.jpg")
      image = MiniMagick::Image.open(Rails.root.join("images").join(im.original))
      image.crop "#{im.width/im.zoom}x#{im.height/im.zoom}+#{im.left}+#{im.top}"
      #image.combine_options do |c|
        #c.crop(@image.width/@image.zoom, @image.height/@image.zoom, @image.left, @image.top)
      #  c.crop "#{@image.width/@image.zoom}x#{@image.height/@image.zoom}+#{@image.left}+#{@image.top}"
      #  c.thumbnail "#{image.width/@image.zoom}x#{image.height/@image.zoom}"
      #  c.gravity 'northeast'
      #  #c.gravity 'center'
      #  c.extent "#{@image.left}x#{@image.top}"
      #end
      image.write(@cropped_path)
      image
      #ImageProcessing::MiniMagick.crop!(image, @image.width/@image.zoom, @image.height/@image.zoom, @image.left, @image.top)
    end

    def process_image(image)
      analyze_image(image)
      process_medium_version(image, Rails.root.join("public").join("preview").join("medium.jpg"))
      process_small_version(image, Rails.root.join("public").join("preview").join("small.jpg"))
      process_tiny_version(image, Rails.root.join("public").join("preview").join("tiny.jpg"))
    end
    
    def create_thumbnail_if_not_exist(im)
      analyze_image(im)
      path = Rails.root.join("public").join("thumbnails").join("#{im.id}.jpg")
      process_tiny_version(im, path) unless path.exist?
    end
end
