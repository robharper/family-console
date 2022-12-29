#!/bin/sh
source .env
npm run build
aws s3 sync ./build ${S3_URI}