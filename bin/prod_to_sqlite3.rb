#!/usr/bin/env ruby

path = "db/migrated.sqlite3"
system("rm #{path}") if File.file? path

raw = `heroku config | grep DATABASE_URL`
db_path = raw[(raw.index('postgres://'))..-1].strip

# FIXME: The application sequel was not installed and this command was not showing any error when running the script...
system("sequel -C #{db_path} sqlite://#{path}")

#system("rails website:sync_from_b2_to_local")
#system("rails website:convert_sync_to_local")
