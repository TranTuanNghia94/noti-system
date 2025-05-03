@echo off
setlocal enabledelayedexpansion

:: Read credentials from .env file
for /f "tokens=1,* delims==" %%a in (.env) do (
    set "%%a=%%b"
)

:: Get HCP API token using PowerShell
for /f "tokens=*" %%a in ('powershell -Command "$response = Invoke-RestMethod -Uri 'https://auth.idp.hashicorp.com/oauth2/token' -Method Post -Body @{client_id='%HCP_CLIENT_ID%'; client_secret='%HCP_CLIENT_SECRET%'; grant_type='client_credentials'; audience='https://api.hashicorp.cloud'} -ContentType 'application/x-www-form-urlencoded'; $response.access_token"') do set "HCP_API_TOKEN=%%a"

:: Get secrets and write to .env files using PowerShell
powershell -Command "$response = Invoke-RestMethod -Uri 'https://api.cloud.hashicorp.com/secrets/2023-11-28/organizations/1f1a999e-28fa-4cf4-8ae6-2cce12d8950b/projects/66e84643-906e-4646-ae99-04da34757f17/apps/sample-app/secrets:open' -Method Get -Headers @{Authorization='Bearer %HCP_API_TOKEN%'}; $secrets = $response.secrets; $envContent = ''; foreach ($secret in $secrets) { $envContent += $secret.name + '=' + $secret.static_version.value + \"`n\" }; $envContent | Out-File -FilePath './mongodb-init/.env' -Encoding utf8;"

echo Secrets have been written to .env files successfully.

endlocal
