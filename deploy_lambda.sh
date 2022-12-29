#!/bin/sh
source .env

cd lambda
npm install
zip -r lambda.zip .
aws lambda update-function-code --function-name ${LAMBDA_NAME} --zip-file fileb://lambda.zip --publish
cd -