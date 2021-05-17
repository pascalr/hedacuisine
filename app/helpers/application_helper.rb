module ApplicationHelper

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
    return text unless current_language
    @translations = Translation.all
    r = @translations.find_by(original: text.downcase, to: current_language.id)
    return r.translated if r
    text
  end

  def link_to_active(name, path, options={})
    options[:class] += " active" if current_page?(path)
    link_to name, path, options
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

  #def pretty_ingredient_value(value, unit)
  #  return number_with_precision value, precision: 2, strip_insignificant_zeros: true if unit.blank? or not unit.show_fraction
  #  #fractions = [1/8r, 1/4r, 1/3r, 3/8r, 1/2r, 5/8r, 2/3r, 3/4r, 7/8r]
  #  fractions = [0, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 7/8r, 1]
  #  f_part = value.modulo(1)
  #  i = fractions.index { |f| (f.to_f-f_part).abs < 0.04 }
  #  return number_with_precision value, precision: 2, strip_insignificant_zeros: true if i == nil
  #  return value.to_i.to_s if i == 0
  #  return (value.to_i+1).to_s if i == fractions.size - 1
  #  return fractions[i] if value.to_i == 0
  #  "#{value.to_i} #{fractions[i]}"
  #  #value.to_r.rationalize(0.125)
  #end
  
  def close_to_fraction?(value)
    fractions = [1/8r, 1/4r, 1/3r, 1/2r, 2/3r, 3/4r, 1]
    fractions.select { |f|
      return true if (value.to_f - f).abs < 0.02
    }
    false
  end

  def t_no_span(e)
    strip_tags(t(e))
  end

end
