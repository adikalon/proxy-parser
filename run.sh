#!/bin/sh

cd $(dirname "$(readlink -f "$0")")
node_modules/electron/dist/electron app.js
