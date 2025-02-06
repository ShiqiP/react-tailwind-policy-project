# Express + AWS Lambda Serverless + DynamoDB

## Introduction

This is an simple authentication project, which I use to learn and practice serverless development. This project use **express** for backend api service, **AWS DynamoDB** for database, **AWS lambda function** and **API gateway** for endpoint to deploy serverless application, and use **S3** for files storage.

**Features**

- Sign in. Use **jsonwebtoken** to identify authenticated users
- Sign up. Use **bcryptjs** to store encrypted password to data base.
- Image files storage. Connect to S3 and get S3 presigned url which is provided to frontend to upload files to S3 bucket directly.
- Update URL. Once frontend upload files to S3 successfully, frontend send url to update user's img_url

## Serverless Deployment

- npm run build
- npm install -g serverless
- serverless --provider aws --key [access-key] --secret [secret-key]
- sercerless deploy

## DynamoDB

### Create

- **UsersTable** partition key is **email**

### configuration

- If you wanna connect it loccally, you need AWS **access-key-id** and **secret-access-key** to connect it. Congfiure .env as following **.env** settings

## S3 Bucket

- Create a s3 bucket
- configure it's access policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::S3BucketName/*"
    }
  ]
}
```

## .env

```bash
AWS_ACCESS_KEY_ID =
AWS_SECRET_ACCESS_KEY =
AWS_DEFAULT_REGION = us-east-1
S3_NAME_FOR_UPLOADS_FILES = S3BucketName
TOKEN_SECRET =
```
