class Food < ApplicationRecord
  
  def color_string
    return nil if color.nil?
    "##{color.to_s(16)}"
  end

  def color_string=(str)
    self.color = str[1..-1].to_i(16)
  end

  #def to_param
  #  "#{id}-#{name}"
  #end
end
