module ApplicationHelper

  def _file_ext(file)
    File.extname(file.filename.to_s)
    #type = file.content_type
    #case type.to_s
    #when "image/bmp" then ".bmp"
    #when "image/gif" then ".gif"
    #when "image/x-icon" then ".ico"
    #when "image/jpeg" then ".jpg"
    #when "image/png" then ".png"
    #when "image/svg+xml" then ".svg"
    #when "image/tiff" then ".tiff"
    #when "image/webp" then ".webp"
    #else
    #  raise "Invalid content type #{type}"
    #end
  end
  def base_image_path(image)
    "/images/#{image.id}"
  end
  def medium_image_path(image)
    return nil if image.nil?
    "#{base_image_path(image)}/medium#{_file_ext(image.original)}"
  end
  def small_image_path(image)
    return nil if image.nil?
    "#{base_image_path(image)}/small#{_file_ext(image.original)}"
  end
  def thumb_image_path(image)
    return nil if image.nil?
    "#{base_image_path(image)}/thumb#{_file_ext(image.original)}"
  end

  def prod_url(path)
    "https://www.hedacuisine.com#{path}"
  end

  def current_language
    @current_language ||= Language.find_by(locale: params[:locale] || I18n.default_locale)
  end

  def current_user_admin?
    current_user && current_user.admin?
  end

  def current_unit_system
    params[:unit_system_id] ? UnitSystem.find(params[:unit_system_id]) : UnitSystem.default
  end

  def translated(text)
    return text if current_language.nil? or text.blank? or current_language == Language.default
    is_capitalized = (not text[0].match /[[:lower:]]/)
    @translations = Translation.all
    r = @translations.find_by(original: text.downcase.gsub(/\r\n/, "\n"), to: current_language.id)
    if r
      return r.translated unless is_capitalized
      ans = r.translated
      ans[0] = ans[0].capitalize
      return ans
    end
    MissingTranslation.create(content: text)
    text
  end
  alias tr translated
  
  def link_to_active_controller(name, path, ctrl_name, options={})
    options[:class] += " active" if ctrl_name == controller_name
    link_to name, path, options
  end
  
  def link_to_active_if(cond, name, path, options={})
    options[:class] += " active" if cond
    link_to name, path, options
  end

  def link_to_active(name, path, options={})
    options[:class] += " active" if current_page?(path)
    link_to name, path, options
  end

  def link_to_active_tab(name, nb, options={})
    # TODO: Allow a different param name than active_tab
    options[:class] += " active" if (params[:active_tab].to_i == nb) ||  (params[:active_tab].blank? && nb == 1)
    link_to name, url_for(active_tab: nb), options
  end

  def article_for(name)
    sanitized = name.gsub(/[^0-9A-Za-z]/, '_')
    if current_language
      locale_file = Rails.root.join("articles").join(sanitized).join("#{current_language.locale}.html")
      #puts "Checking for path = #{locale_file}"
      # FIXME: How to do it properly?
      return render inline: File.read(locale_file), layout: false if locale_file.exist?
      #return render file: locale_file.to_s, layout: false
    end

    index = Rails.root.join("articles").join(sanitized).join("index.html")
    # FIXME: How to do it properly?
    render inline: File.read(index), layout: false if index.exist?
    #render file: index.to_s, layout: false if index.exist?
  end

  def capitalize_first_letter(str)
    return str if str.blank?
    str[0] = str[0].capitalize
    str
  end

  def t_no_span(e)
    strip_tags(t(e))
  end

end
