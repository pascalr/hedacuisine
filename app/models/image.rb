class Image < ApplicationRecord
  has_one_attached :original

  has_many :recipes
  has_many :recipe_kinds

  def original=(file)
    super(file)
    update_file_info
  end

  def update_file_info
    self.filename = self.original ? self.original.filename.to_s : nil
    self.extension = self.original ? File.extname(self.filename) : nil
  end

  # image_tag user.avatar.variant(resize_to_limit: [100, 100], format: :jpeg, sampling_factor: "4:2:0", strip: true, interlace: "JPEG", colorspace: "sRGB", quality: 80)

  VARIANTS = {
    thumb: {width: 71, height: 48},
    portrait_thumb: {width: 71, height: 106.5},
    small: {width: 255, height: 171},
    medium: {width: 452, height: 304}
  }
  def thumb_variant
    original.representation(resize_to_fill: [VARIANTS[:thumb][:width], VARIANTS[:thumb][:height]])
  end
  def portrait_thumb_variant
    original.representation(resize_to_fill: [VARIANTS[:portrait_thumb][:width], VARIANTS[:portrait_thumb][:height]])
  end
  def small_variant
    original.representation(resize_to_fill: [VARIANTS[:small][:width], VARIANTS[:small][:height]])
  end
  def medium_variant
    original.representation(resize_to_fill: [VARIANTS[:medium][:width], VARIANTS[:medium][:height]])
  end

  def width
    original.analyze unless original.analyzed?
    original.metadata[:width]
  end
  def height
    original.analyze unless original.analyzed?
    original.metadata[:height]
  end
  def aspect_ratio
    self.width.to_f / self.height.to_f
  end

  # FIXME: This is recent in rails and it does not work yet for me. calling image.original.variant(:thumb) like the docs says does not work yet
  #do
  #  attachable.variant :thumb, resize: "71x48"
  #  attachable.variant :small, resize: "255x171"
  #  attachable.variant :medium, resize: "452x304"
  #end
  #has_one_attached :thumb
  #has_one_attached :small
  #has_one_attached :medium
end
