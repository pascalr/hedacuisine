namespace :database do
  #task :password do # DEPRECATED. This is handled by heroku and figaro now 
  #  pwd = Rails.application.credentials.dig(:db, :password)
  #  ENV["PGPASSWORD"] = pwd
  #end
  task load_dev: [:environment] do |t, args|
    system("pg_restore --verbose --clean --no-acl --no-owner -w -h localhost -U hedacuisine -d hedacuisine_development #{ENV["LOAD_FILE"]}")
  end
  task load_local: [:environment] do
    system("pg_restore --verbose --clean --no-acl --no-owner -w -h localhost -U hedacuisine -d hedacuisine_local #{ENV["LOAD_FILE"]}")
  end

end
