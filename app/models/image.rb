class Image < ApplicationRecord

  has_many :recipes
  has_many :recipe_kinds

  has_one_attached :original

  def self.exist?(im)
    return im && im.original.attached?
  end

  def original=(file)
    super(file == '' ? nil : file)
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
    medium: {width: 452, height: 304},
    small_book: {width: 178, height: 258}, # La variante devrait avoir une hauteur minimale du livre sur la page d'acceuil, et une largeur minimale du livre dans le preview à gauche.
    book: {width: 356}
  }
  def variant(name)
    case name.to_s
    when 'thumb' then thumb_variant
    when 'portrait_thumb' then portrait_thumb_variant
    when 'small' then small_variant
    when 'medium' then medium_variant
    when 'small_book' then small_book_variant
    when 'book' then book_variant
    else
      raise "Error missing variant #{name}"
    end
  end
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
  def book_variant
    original.representation(size: "#{VARIANTS[:book][:width]}x")
  end
  def small_book_variant
    # La variante devrait avoir une hauteur minimale du livre sur la page d'acceuil, et une largeur minimale du livre dans le preview à gauche.
    # If the image is wider than the minimums, than limit by height
    if self.aspect_ratio > (VARIANTS[:small_book][:width].to_f / VARIANTS[:small_book][:height].to_f)
      # Limit with a really wide image, so it should limit by height only
      original.representation(resize_to_limit: [VARIANTS[:small_book][:height]*2, VARIANTS[:small_book][:height]])
    else # limit by width
      # Limit with a really tall image, so it should limit by width only
      original.representation(resize_to_limit: [VARIANTS[:small_book][:width], VARIANTS[:small_book][:width]*3])
    end
  end
  def small_book_width
    return nil unless original.attached?
    (VARIANTS[:small_book][:height].to_f * self.aspect_ratio.to_f).to_i
  end
  def small_book_height
    return nil unless original.attached?
    (VARIANTS[:small_book][:width].to_f / self.aspect_ratio.to_f).to_i
  end

  def width
    return nil unless original.attached?
    original.analyze unless original.analyzed?
    original.metadata[:width]
  end
  def height
    return nil unless original.attached?
    original.analyze unless original.analyzed?
    original.metadata[:height]
  end
  def aspect_ratio
    return nil unless original.attached?
    self.width.to_f / self.height.to_f
  end

  def to_obj(params={})
    extract_attributes(params, :author, :source, :filename, :is_user_author)
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
