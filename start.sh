#!/usr/bin/env bash
set -e
export MONGODB_URI="${MONGODB_URI:-mongodb://127.0.0.1:27017}"
export MONGODB_DB="${MONGODB_DB:-bhurakshak}"
npm install
npm start
