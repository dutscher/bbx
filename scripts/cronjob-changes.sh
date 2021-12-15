#!/bin/bash
# https://manual.uberspace.de/daemons-cron/
# 37 13 * * * /home/dutscher/bbx.willy-selma.de/scripts/cronjob-changes.sh > /home/dutscher/tmp/bbx.cron.log 2>&1
echo "commit change"
cd /home/dutscher/bbx.willy-selma.de/scripts/
# get latest repo changes
git pull
# fetch graphql
npm run fetch
# add all changes
git add .*
# use json for commit message
# ../data/api-changes.last-cursor.json
value=$(<../data/api-changes.last-cursor.json)
git commit -m "Cronjob add latest changes: $value"
# update repo
# https://github.com/dutscher/bbx.git
login=$(<./bbx.secret)
git push "https://$login@github.com/dutscher/bbx.git" --all
# reset exectuable shell for cronjob
chmod 777 ./cronjob-changes.sh

#git reset --hard
