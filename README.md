# React Deployment Nirvana

> Your deploys have never been so free of suffering.

## About this guide

This guide will help you register a domain and set it up with Route 53, Cloudfront and S3 to have a simple deploy process.
WRITE MOAR HERE

## Initial setup: getting CircleCI to work

If you complete the following steps, you should be able to push a new version to the repository

* Clone this repository using Github.
* Create a CircleCI account, if you do not have one, and associate it with your Github account.
* Create an AWS account.
* Go to `https://console.aws.amazon.com/iam/home` and create a user (e.g. `Circle-CI`), to which you should add programmatic access and `AmazonS3FullAccess` permissions.
* Add its Access Key ID and Secret Access Key to CircleCI by going to `Project Settings | AWS Permissions`.
* Create an S3 Bucket, e.g. `my-super-cool-bucket`.
* In build.sh, deploy.sh and upload.sh, change `aws-pres` to `my-super-cool-bucket`.

Now, push your changes to Github and open up CircleCI. You should see your build succeed, and your S3 bucket should have the following structure:

```
staging/index.html
staging/$SOME_HASH/index.html
staging/$SOME_HASH/bundle.js
staging/$SOME_HASH/cutedog.png
```

## Initial steps: setting up the various AWS services

### S3

* Go to your bucket in the AWS console, click properties, and enable static website hosting. You need to specify an index document, although this won't be used. I put "unused".
* Take note of the endpoint. It should be similar to `aws-pres.s3-website-us-east-1.amazonaws.com`

### Cloudfront

### Route 53

### 