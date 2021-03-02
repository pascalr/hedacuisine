module ApplicationHelper
  def link_to_active(name, path, options={})
    options[:class] += " active" if current_page?(path)
    link_to name, path, options
  end
end
