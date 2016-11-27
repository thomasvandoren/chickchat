#!/usr/bin/env bash

set -e

KMS_KEY_ARN=${KMS_KEY_ARN:-''}
if [ -z "${KMS_KEY_ARN}" ] ; then
  echo "Set KMS_KEY_ARN environment variable"
  exit 1
fi

aws --region us-west-2 --output json --query 'CiphertextBlob' kms encrypt --key-id ${KMS_KEY_ARN} --plaintext $1
