# Run after you set DATABASE_URL in .env (see SETUP_NODOCKER.md)
Set-Location $PSScriptRoot\..

Write-Host "Running database migrations..." -ForegroundColor Cyan
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed. Is DATABASE_URL set in .env?" -ForegroundColor Red
    exit 1
}

Write-Host "Starting the app..." -ForegroundColor Cyan
Set-Location apps\web
npm run dev
