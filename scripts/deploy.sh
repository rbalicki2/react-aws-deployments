DIST_HASH=${1:-$CIRCLE_SHA1}

if [ -z $DIST_HASH ]; then
  echo "***** A hash to deploy is needed. Bailing..."
  exit 1
fi

aws s3 cp \
  s3://$S3_BUCKET/$S3_BUCKET_FOLDER/$DIST_HASH/index.html \
  s3://$S3_BUCKET/$S3_BUCKET_FOLDER/index.html \
  --acl public-read \
  --cache-control max-age=0,no-cache \
  --metadata-directive REPLACE

if [ $? -ne 0 ]; then
  echo "***** Failed setting build $DIST_HASH build as active"
  slack "*dash* deployment status for $DEPLOY_NAME: failed"
  exit 1
fi

echo "***** Succeeded activating build $DIST_HASH for $NODE_ENV in $S3_BUCKET_FOLDER"