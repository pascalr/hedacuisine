#!/usr/bin/env ruby

raw = `heroku config | grep DATABASE_URL`
system("rm db/migrated.sqlite3")
db_path = raw[(raw.index('postgres://'))..-1].strip

system("sequel -C #{db_path} sqlite://db/migrated.sqlite3")

system("rails website:sync_from_b2_to_local")
system("rails website:convert_sync_to_local")
