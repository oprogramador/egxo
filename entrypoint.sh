#!/bin/bash
set -e

npm install
APP_DIR=src npm run postinstall
npm start
