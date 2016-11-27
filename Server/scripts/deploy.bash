#!/usr/bin/env bash

set -e

CWD=$(cd $(dirname $0) ; pwd)
REPO_ROOT=$(cd $CWD/.. ; pwd)

function log_date() {
  echo -n "$(date +'%Y-%m-%d %H:%M:%S')"
}

function log_info() {
  local msg=$@
  log_date
  echo " [INFO] ${msg}"
}

function log_error() {
  local msg=$@
  log_date
  echo " [ERROR] ${msg}"
}

aws_cli=$(which aws 2> /dev/null)
if [ -z "${aws_cli}" ] ; then
  log_error "Could not find aws cli."
  exit 1
fi

ARTIFACT_NAME=api_backend.zip
ARTIFACT=${REPO_ROOT}/${ARTIFACT_NAME}

if [ ! -f ${ARTIFACT} ] ; then
  log_error "Could not find artifact at: ${ARTIFACT}"
  log_error "Run 'yarn package' before deploying."
  exit 1
fi

AWS="${aws_cli} --output json --region us-west-2"

S3_BUCKET=chickchat-artifacts
artifact_cnt=$($AWS s3api list-buckets --query "Buckets[?Name == '$S3_BUCKET'].Name[] | length(@)")

if [ $artifact_cnt = "0" ] ; then
  log_info "Creating s3 bucket named: ${S3_BUCKET}"
  $AWS s3api create-bucket --bucket ${S3_BUCKET}
  $AWS s3api put-bucket-versioning \
    --bucket ${S3_BUCKET} \
    --versioning-configuration 'Status=Enabled'
fi

S3_ARTIFACT=s3://${S3_BUCKET}/${ARTIFACT_NAME}
$AWS s3 cp ${ARTIFACT} ${S3_ARTIFACT}
log_info "Uploaded ${ARTIFACT_NAME} to ${S3_ARTIFACT}"
