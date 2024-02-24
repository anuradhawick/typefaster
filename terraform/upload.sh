#!/bin/bash
set -e
cd ${1}
aws s3 sync . "s3://${2}/${3}" --delete