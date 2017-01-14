DIST_HASH=${2:-$CIRCLE_SHA1}

if [ -z $DIST_HASH ]; then
  echo "***** A hash to deploy is needed. Bailing..."
  exit 1
fi

S3_BUCKET=aws-pres
S3_BUCKET_FOLDER=$1

if [ -z $S3_BUCKET_FOLDER ]; then
  echo "***** S3_BUCKET_FOLDER is required. Bailing..."
  exit 1
fi

aws s3 cp \
  s3://$S3_BUCKET/$S3_BUCKET_FOLDER/$DIST_HASH \
  s3://$S3_BUCKET/$S3_BUCKET_FOLDER/stage \
  --acl public-read \
  --cache-control max-age=0,no-cache \
  --metadata-directive REPLACE \
  --recursive

date +%s%N

aws s3 rm s3://$S3_BUCKET/$S3_BUCKET_FOLDER/current/

aws s3 mv s3://$S3_BUCKET/$S3_BUCKET_FOLDER/stage/ \
  s3://$S3_BUCKET/$S3_BUCKET_FOLDER/current/ --recursive

date +%s%N

if [ $? -ne 0 ]; then
  echo "***** Failed setting build $DIST_HASH build as active"
  exit 1
fi

echo "***** Succeeded activating build $DIST_HASH for $NODE_ENV in $S3_BUCKET_FOLDER"