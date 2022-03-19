class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  scope :with_image, ->(image_field_name) { includes(Hash[image_field_name, original_attachment: :blob]) }

  def owned_by?(user)
    return false unless user
    self.user_id == user.id
  end

  # OMG c'est compliqué de loader comme je voudrais faire. Cela impliquerait de créer de nouveaux record à partir de json...
  # Je pourrais peut-être en trichant avec accepts_nested_attributes_for... en disablant la sécurité...
  #def load(str)
  #  json = JSON.parse(str)
  #  assocs = self.class.reflect_on_all_associations
  #  json.each do |attr, value|
  #    if assocs.map(&:name).include? attr.to_sym
  #    else
  #    end
  #    raise "Unkown association for #{record}" 
  #    self.send("#{attr}=", value)
  #    if value.is_a? Hash
  #    end
  #  end
  #end

protected
  # TODO: Add the parameter variant.
  # This would allow to define many different ways to serialize and obj.
  # For example:
  # extract_attributes(params, :name) # DEFAULT
  # extract_attributes(params.merge(variant_def: :complete), :name, :long, :list, :attrs)
  # that you call using record.to_obj(variant: :complete)
  # I don't know... Why not simply call it to_complete_obj as a completely new method?
  def extract_attributes(params, *attributes)
    attrs = nil
    if params && params[:only]
      attrs = params[:only].is_a?(Array) ? params[:only] : [params[:only]]
    elsif params && params[:except]
      # TODO when needed
    else
      attrs = attributes
    end
    obj = attrs.inject({}) {|extracted, attr| extracted[attr] = self.send(attr); extracted}
    obj[:class_name] = self.class.name.underscore
    obj[:id] = self.id
    extract_assoc(obj, self, params[:includes]) if params && params[:includes]
    obj
  end

private
  def extract_assoc(obj, record, assoc, params={})
    if assoc.is_a? Array
      assoc.each {|a| obj = extract_assoc(obj, record, a) }
      return obj
    end
    if assoc.is_a? Hash
      assoc.each do |assoc_name, nested_association|
        obj = extract_assoc(obj, record, assoc_name, nested_association)
      end
      return obj
    end
    assoc = assoc.to_sym
    assocs = record.class.reflect_on_all_associations
    raise "Unkown association for #{record}" unless assocs.map(&:name).include? assoc
    val = record.send(assoc)
    if val.is_a?(Enumerable) # has_many association
      obj[assoc] = val.map {|v| v ? v.to_obj(params.blank? ? nil : {includes: params}) : nil}
    else # has_one or belongs_to association
      obj[assoc] = val ? val.to_obj(params.blank? ? nil : {includes: params}) : nil
    end
    obj
  end
end
