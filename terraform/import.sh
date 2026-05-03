#!/bin/bash
if terraform state list | grep -q aws_s3_bucket.apps_bucket; then
  echo "S3 bucket already imported."
else
  terraform import aws_s3_bucket.apps_bucket apps-anuradhawick
  echo "S3 bucket imported successfully."
fi
