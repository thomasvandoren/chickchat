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

S3_BUCKET=chickchat-artifact
artifact_cnt=$($AWS s3api list-buckets --query "Buckets[?Name == '$S3_BUCKET'].Name[] | length(@)")

if [ $artifact_cnt = "0" ] ; then
  log_info "Creating s3 bucket named: ${S3_BUCKET}"
  $AWS s3api create-bucket \
    --bucket ${S3_BUCKET} \
    --create-bucket-configuration 'LocationConstraint=us-west-2'
  $AWS s3api put-bucket-versioning \
    --bucket ${S3_BUCKET} \
    --versioning-configuration 'Status=Enabled'
fi

S3_ARTIFACT=s3://${S3_BUCKET}/${ARTIFACT_NAME}
$AWS s3 cp ${ARTIFACT} ${S3_ARTIFACT}
log_info "Uploaded ${ARTIFACT_NAME} to ${S3_ARTIFACT}"

LAMBDA_NAME=chickchat-api-AppFunction-1SPI4QOVYRX4P

SWAGGER_TMPL=swagger.tmpl.yaml
SWAGGER_NAME=swagger.yaml
SWAGGER=${REPO_ROOT}/${SWAGGER_NAME}

cat ${REPO_ROOT}/${SWAGGER_TMPL} \
  | sed "s/@@LAMBDA_NAME@@/${LAMBDA_NAME}/g" \
  > ${SWAGGER}

S3_SWAGGER=s3://${S3_BUCKET}/${SWAGGER_NAME}
$AWS s3 cp ${SWAGGER} ${S3_SWAGGER}
log_info "Uploaded ${SWAGGER_NAME} to ${S3_SWAGGER}"

STACK_NAME=chickchat-api
$AWS s3 cp aws-sam.yaml s3://${S3_BUCKET}/aws-sam.yaml
$AWS s3api put-object-acl \
  --bucket ${S3_BUCKET} \
  --key aws-sam.yaml \
  --grant-read uri=http://acs.amazonaws.com/groups/global/AllUsers

# stack_exists=$($AWS --query "StackSummaries[?StackName == 'chickchat-api'] | @[?StackStatus == 'CREATE_COMPLETE'].StackId | length(@)" cloudformation list-stacks)
# if [ "${stack_exists}" = "0" ] ; then
#   log_info "Deploying cloudformation stack: ${STACK_FORMATION}"
#   $AWS cloudformation deploy \
#     --template-file rendered-aws-sam.yaml \
#     --capabilities CAPABILITY_IAM \
#     --stack-name ${STACK_NAME} \
#     || true
# fi

# log_info "Updating stack..."
# $AWS cloudformation update-stack \
#   --stack-name ${STACK_NAME} \
#   --template-url https://s3-us-west-2.amazonaws.com/${S3_BUCKET}/aws-sam.yaml

log_info "Deployed cloudformation stack: ${STACK_FORMATION}"

$AWS lambda update-function-code \
  --function-name ${LAMBDA_NAME} \
  --s3-bucket ${S3_BUCKET} \
  --s3-key ${ARTIFACT_NAME} \
  --publish
