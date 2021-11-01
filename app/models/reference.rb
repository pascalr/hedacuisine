class Reference < ApplicationRecord
  belongs_to :recipe

  def url
    return nil unless url?
    return @_uri.to_s
  end

  def url?
    @_uri ||= URI.parse(self.raw)
    return @_uri.host && (@_uri.kind_of?(URI::HTTP) || @_uri.kind_of?(URI::HTTPS))
  rescue URI::InvalidURIError
    false
  end
end
