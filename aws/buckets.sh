#!/bin/bash
set -x
awslocal s3 mb s3://tsbackend
awslocal s3 cp /tmp/aws/default-image.jpg s3://tsbackend/
set +x