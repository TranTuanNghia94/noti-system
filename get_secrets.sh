#!/bin/bash

# Read credentials from .env file
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Get HCP API token
HCP_API_TOKEN=$(curl --location "https://auth.idp.hashicorp.com/oauth2/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=$HCP_CLIENT_ID" \
--data-urlencode "client_secret=$HCP_CLIENT_SECRET" \
--data-urlencode "grant_type=client_credentials" \
--data-urlencode "audience=https://api.hashicorp.cloud" | jq -r .access_token)

# Get secrets and write to .env files
curl --location "https://api.cloud.hashicorp.com/secrets/2023-11-28/organizations/1f1a999e-28fa-4cf4-8ae6-2cce12d8950b/projects/66e84643-906e-4646-ae99-04da34757f17/apps/sample-app/secrets:open" \
--request GET \
--header "Authorization: Bearer $HCP_API_TOKEN" | jq -r '.secrets[] | "\(.name)=\(.static_version.value)"' > ./email-service/.env

# Copy the same content to other .env files
cp ./email-service/.env ./notification-service/.env
cp ./email-service/.env ./telegram-service/.env
cp ./email-service/.env ./kong/.env
echo "Secrets have been written to .env files successfully."
