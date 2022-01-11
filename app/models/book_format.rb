class BookFormat < ApplicationRecord
  def page_aspect_ratio
    self.page_width_mm / self.page_height_mm
  end
end
