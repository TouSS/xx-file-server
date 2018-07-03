#!/bin/bash

export RUN_DIR=$(cd `dirname $0`; pwd)
export NODE_HOME=$RUN_DIR/runtime
export PM2_HOME=$RUN_DIR/node_modules
export PATH=$PATH:$NODE_HOME/bin:$PM2_HOME/.bin
chmod +x $PM2_HOME/.bin/*

if [ $1 = "start" ]
then
  pm2 start $RUN_DIR/index.js -i max --watch --log-date-format "YYYY-MM-DD HH:mm Z" &
elif [ $1 = "stop" ]
then
  pm2 stop all &
elif [ $1 = "state" ]
then
  pm2 monit
elif [ $1 = "restart" ]
then
  pm2 stop all
  pm2 start $RUN_DIR/index.js -i max --watch --log-date-format "YYYY-MM-DD HH:mm Z" &
elif [ $1 = "list" ]
then
  pm2 list &
else
  echo "start|stop|state|restart is enalbe for this shell."
fi
