#!/bin/bash
# https://manual.uberspace.de/daemons-cron/
# crontab -l
# 0 8 * * * /scripts/cronjob-changes.sh > /tmp/bbx.cron.800.log 2>&1
# 37 13 * * * /scripts/cronjob-changes.sh > /tmp/bbx.cron.1337.log 2>&1
# 11 22 * * * /scripts/cronjob-changes.sh > /tmp/bbx.cron.2211.log 2>&1
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
git commit -m "Cronjob changes: $value"
# update repo
# https://github.com/dutscher/bbx.git
login=$(<./bbx.secret)
git push "https://$login@github.com/dutscher/bbx.git" --all
# reset exectuable shell for cronjob
chmod 777 ./cronjob-changes.sh

#git reset --hard
