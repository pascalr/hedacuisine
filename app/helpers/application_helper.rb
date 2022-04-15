module ApplicationHelper
  
  def _current_user
    return nil if current_account.blank?
    u = current_account.users.find(session[:current_user_id]) if session[:current_user_id]
    if u.blank?
      u = current_account.users.first
      u = current_account.users.create! if u.blank? 
      session[:current_user_id] = u.id
    end
    u
  end
  def current_user
    @current_user ||= _current_user
  end

  def css_import_tag(name, params={})
    stylesheet_link_tag(name, params)
  end

  def js_import_tag(name)
    javascript_include_tag(name, defer: true)
    #javascript_import_module_tag(name) # For import maps if I ever convert
  end

  def current_user_id
    current_user ? current_user.id : nil
  end
  
  def color_to_hex_string(color)
    return nil if color.nil?
    "##{color.to_s(16).rjust(6,'0')}"
  end

  def hex_string_to_color(str)
    str[1..-1].to_i(16)
  end

  def regional_url_for(args)
    url_for({locale: current_region.locale}.merge(args))
  end

  def link_to_if(cond, *args, &block)
    content = capture(&block)
    if cond
      link_to args do
        content
      end
    else
      content
    end
  end

  # Probablement inutile... Attendre pour voir.
  def recipe_in_category_path(recipe_kind, args={})
    if args[:recipe_id]
      recipe_kind_path(recipe_kind, args)
    else
      if current_user
        recipes = recipe_kind.recipes.where(is_public: true).or(recipe_kind.recipes.where(user_id: current_user_id))
      else
        recipes = recipe_kind.recipes.all_public
      end
      if recipes.first
        recipe_kind_path(recipe_kind, {recipe_id: recipes.first.id}.merge(args))
      else
        recipe_kind_path(recipe_kind, args)
      end
    end
  end

  def public_editor_url(path)
    Rails.env == "local" ? "https://aqueous-fortress-30634.herokuapp.com#{path}" : path
  end
  def public_url(path)
    Rails.env == "production" ? "https://www.hedacuisine.com#{path}" : path
  end
  def _base_image_path(image)
    "/images/#{image.id}"
  end
  def image_variant_path(image, variant)
    return '' if image.nil? || variant.nil? || image.extension.nil?
    "#{_base_image_path(image)}/#{variant}#{image.extension}"
  end
  def original_image_path(image)
    return nil if image.nil?
    "#{_base_image_path(image)}/original#{image.extension}"
  end
  # All below should be deprecated? Can I use image_variant_path(image, :thumb) everywhere?
  def small_image_path(image)
    return nil if image.nil?
    "#{_base_image_path(image)}/small#{image.extension}"
  end
  def thumb_image_path(image)
    return nil if image.nil?
    "#{_base_image_path(image)}/thumb#{image.extension}"
  end
  def portrait_thumb_image_path(image)
    return nil if image.nil?
    "#{_base_image_path(image)}/portrait_thumb#{image.extension}"
  end

  def icon_path(name)
    "/icons/#{name}"
  end

  def prod_url(path)
    "https://www.hedacuisine.com#{path}"
  end

  def current_language
    #@current_language ||= Language.find_by(locale: params[:locale] || I18n.default_locale)
    @current_language ||= current_region.language
  end

  def current_region
    # route_translator seems to send the locale as a param instead of sending the region...
    #ugly_fix = params[:region] && params[:region].length > 2
    #if ugly_fix
    #  @current_region ||= Region.find_by(locale: params[:region])
    #else
    #  @current_region ||= Region.find_by(code: params[:region] || DEFAULT_REGION)
    #end
    if !params[:locale].blank?
      @current_region ||= Region.find_by(locale: params[:locale])
    elsif !params[:region].blank?
      @current_region ||= Region.find_by(code: params[:region])
    else
      @current_region ||= Region.find_by(locale: I18n.default_locale)
    end
  end

  def current_user_admin?
    current_account && current_account.admin?
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

  def asset_exist?(path)
    if Rails.configuration.assets.compile
      return true # FIXME: I disabled the next line because it was not working in dev for flags.
      #Rails.application.precompiled_assets.include? path
    else
      Rails.application.assets_manifest.assets[path].present?
    end
  end


end
