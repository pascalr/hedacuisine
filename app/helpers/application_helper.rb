module ApplicationHelper

  def current_language
    @current_language ||= Language.find_by(locale: params[:locale])
  end

  def link_to_active(name, path, options={})
    options[:class] += " active" if current_page?(path)
    link_to name, path, options
  end
end
