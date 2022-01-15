class Page < ApplicationRecord
  belongs_to :book

  attr_accessor :empty # Ugly fix because I don't know how to send an empty form when creating an empty page. Useless otherwise.
end
