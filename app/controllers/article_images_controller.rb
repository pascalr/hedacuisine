class ArticleImagesController < ApplicationController
  def show
    article_name = params[:article_name].gsub(/[^0-9A-Za-z]/, '_') # sanitize for security
    filename = params[:filename].gsub(/[^0-9A-Za-z]/, '_') # sanitize for security
    ext = params[:extension].gsub(/[^0-9A-Za-z]/, '_') # sanitize for security
    send_file "#{Rails.root}/articles/#{article_name}/#{filename}.#{ext}", type: "image/#{ext}", disposition: 'inline'
  end
end
