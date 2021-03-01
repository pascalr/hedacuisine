#!/bin/bash
heroku pg:backups:capture
heroku pg:backups:download
mv "latest.dump.1" latest.dump
