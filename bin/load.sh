#!/bin/bash
#pg_restore -d hedacuisine_development latest.dump
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U hedacuisine -d hedacuisine_development $1
pg_restore --verbose --clean --no-acl --no-owner -h localhost -U hedacuisine -d hedacuisine_local $1
