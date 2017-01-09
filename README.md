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
* You can, optionally, set up a bucket lifecycle policy to delete files after a certain amount of time.

### Cloudfront

* You'll be creating one cloudfront distribution per environment. For this demo, we'll just worry about setting up staging.
* Create a web distribution with the following settings. Be careful! These settings are intricate and hard to debug.
  * **Origin domain name**: from the dropdown, select your S3 bucket.
  * **Origin path**: Name of the environment, with a slash in front. In this demo, `/staging`
  * **Viewer protocol policy**: Redirect HTTP to HTTPS.
  * **Forward headers**: Whitelist
  * **Whitelist headers**: Origin
  * **Compress Objects Automatically**: Yes
  * **Price class**: I always set the cheapest price class (US, Canada and EU).
  * **Alternative Domain Names**: In this example, `staging.$YOUR_DOMAIN`, e.g. in my case, `staging.myawspresentation.com`
  * **SSL Certificate**: You will need to go back, after setting up your Route 53 settings, and select the appropriate certificate (`*.$YOUR_DOMAIN`).
  * Click create! It will take several minutes for the cloudfront distribution to deploy.

### Route 53 and Certificate Manager

* Register a domain with Route53. It may take Amazon a few minutes to complete your registration, after which you will receive a confirmation email.
* After your Route53 registration is complete, you can request a certificate for `*.$YOUR_DOMAIN`. Use the AWS Certificate Manager to request this. Once this approval completes, you will receive a confirmation email.
  * Once you complete this, go back to your Cloudfront distribution, click on your distribution, `Distribution Settings | General | Edit`, and select this certificate.
* You will do the following steps once per environment. In this demo, we'll just worry about staging.
* Go to Route 53, and click `Create Record Set`. 
  * **Name**: Fill in the environment name, e.g. `staging`
  * **Alias**: Yes
  * **Alias target**: Select your cloudfront distribution.