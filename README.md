# Super Smooth Deployments with React and AWS

> Your deploys have never been so pain-free.

## About this guide

This guide will help you register a domain and set it up with Route53, Cloudfront and S3 to have a smooth deployment process.

## Overall architecture

* Webpack creates your **build** in the `/dist/$GIT_HASH` folder. The `$GIT_HASH` here is important, as it means that every resource URL will be unique, and we never have caching issues.
* We **upload** the contents of the `/dist` folder to `s3://$S3_BUCKET/$ENVIRONMENT`. (After several deploys, your `$ENVIRONMENT` folder have many folders in it.)
* To **deploy**, we simply copy `index.html` from `s3://$S3_BUCKET/$ENVIRONMENT/$GIT_HASH/` to `s3://$S3_BUCKET/$ENVIRONMENT/`, making sure to specify that this file should never be cached. All resources (CSS, JS, etc.) that you request from this `index.html` file will be requested from their `$GIT_HASH` folders, and can be cached indefinitely.
* Cloudfront will compress these files and serve them from S3.
* Route53 will convert an ugly cloudfront URL to a pretty URL.

## Setup the deployment process

Ok! Let's create the deployment process.

### Getting CircleCI to work

If you complete the following steps, you should be able to push a new version to the repository.

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
  * **Default Root Object**: index.html
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