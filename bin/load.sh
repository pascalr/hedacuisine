#!/bin/bash
#pg_restore -d hedacuisine_development latest.dump

if [ "$#" -ne 1 ]; then
    echo "Load expects a file to be loaded."
    exit
fi

export LOAD_FILE=$1

# By error, I loaded an old database version and it fucked everything (it took the schema from back then)
# Running these two lines fixed it. I should probably run them every time, but I am scared to do so.
# I should probably do it for RAILS_ENV=development and for RAILS_ENV=local
#DISABLE_DATABASE_ENVIRONMENT_CHECK=1 rake db:drop
#rake db:create

rails database:load_dev $1
rails database:load_local $1

rails website:sync_from_b2_to_local
rails website:convert_sync_to_local
RAILS_ENV=local rails website:convert_sync_to_local
