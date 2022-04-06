class SuggestionsController < ApplicationController
  #skip_before_action :authenticate_user!, only: [:test]
  #skip_before_action :only_admin!, only: [:test]
  def send_data
    selected = decode_record(params[:selected])
    selected.increment!(:selected_count)
    skipped = params[:skipped].each do |id|
      record = decode_record(id)
      record.increment!(:skip_count)
    end
  end
private
  def decode_record(id)
    args = (id.start_with? "_") ? {recipe_id: id} : {recipe_kind_id: id}
    current_user.suggestions.find_or_create_by(args)
  end
end
