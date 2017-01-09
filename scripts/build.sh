#!/bin/bash

# This file uploads the dist folder to S3 and iff in staging or production, sets it as active

if [ -z $CIRCLECI ]; then
  echo "This script should run on CircleCI only. Bailing..."
  exit 1
fi

export NODE_ENV=$1

echo "***** About to build with environment $NODE_ENV"
npm run build

if [ $? -ne 0 ]; then
  echo "***** Failed uploading build for environment $NODE_ENV to $S3_BUCKET_FOLDER"
  exit 1
fi

echo "***** Succeeding building"