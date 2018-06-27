#!/bin/bash

export RUN_DIR=$(cd `dirname $0`; pwd)
export NODE_HOME=$RUN_DIR/runtime
export PM2_HOME=$RUN_DIR/node_modules
export PATH=$PATH:$NODE_HOME/bin:$PM2_HOME/.bin
chmod +x $PM2_HOME/.bin/*
pm2 monit
