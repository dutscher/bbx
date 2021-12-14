#!/bin/bash
echo "commit change"
# get latest repo changes
git pull
# fetch graphql
npm run fetch
# add all changes
git add .*
# use json for commit message
# ../data/api-changes.last-cursor.json
value=$(<../data/api-changes.last-cursor.json)
git commit -m "Add latest $value"
# update repo
# https://github.com/dutscher/bbx.git
login=$(<./bbx.secret)
git push https://$(login)@github.com/dutscher/bbx.git --all

#git reset --hard
