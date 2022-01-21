class Image < ApplicationRecord
  has_one_attached :original

  has_many :recipes

  def original=(file)
    super(file)
    update_file_info
  end

  def update_file_info
    self.filename = self.original.filename.to_s
    self.extension = File.extname(self.filename)
  end

  # image_tag user.avatar.variant(resize_to_limit: [100, 100], format: :jpeg, sampling_factor: "4:2:0", strip: true, interlace: "JPEG", colorspace: "sRGB", quality: 80)

  def thumb_variant
    original.representation(resize_to_fill: [71, 48])
  end
  def portrait_thumb_variant
    original.representation(resize_to_fill: [71, 106.5])
  end
  def small_variant
    original.representation(resize_to_fill: [255, 171])
  end
  def medium_variant
    original.representation(resize_to_fill: [452, 304])
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
