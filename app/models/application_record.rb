class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def owned_by?(user)
    return false unless user
    self.user_id == user.id
  end

protected
  # TODO: Add the parameter variant.
  # This would allow to define many different ways to serialize and obj.
  # For example:
  # extract_attributes(params, :name) # DEFAULT
  # extract_attributes(params.merge(variant_def: :complete), :name, :long, :list, :attrs)
  # that you call using record.to_obj(variant: :complete)
  # I don't know... Why not simply call it to_complete_obj as a completely new method?
  def extract_attributes(params, *attributes)
    obj = attributes.inject({}) {|extracted, attr| extracted[attr] = self.send(attr); extracted}
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
        #nested = record.send(assoc_name)
        #if nested.is_a?(Enumerable) # has_many association
        #  nested.each {|n| obj = extract_assoc(obj, n, nested_association)}
        #else # has_one or belongs_to association
        #  obj = extract_assoc(obj, nested, nested_association)
        #end
      end
      return obj
    end
    # TODO: Make sure the association exists and avoid send?
    assoc = assoc.to_sym
    val = record.send(assoc)
    if val.is_a?(Enumerable) # has_many association
      obj[assoc] = val.map {|v| v ? v.to_obj(params.blank? ? nil : {includes: :params}) : nil}
    else # has_one or belongs_to association
      obj[assoc] = val ? val.to_obj(params.blank? ? nil : {includes: :params}) : nil
    end
    obj
  end
end
