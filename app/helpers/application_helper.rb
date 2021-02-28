module ApplicationHelper
  def link_to_highlight_active(name, path, options={})
    link_to name, path, options.merge({class: (current_page?(path) ? "topnavlink active" : "topnavlink")})
  end
end
