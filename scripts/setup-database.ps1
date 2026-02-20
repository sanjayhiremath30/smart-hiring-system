# Run this from the project root to start the database and run migrations.
# Requires Docker Desktop to be running.

Write-Host "Starting PostgreSQL with Docker..." -ForegroundColor Cyan
Set-Location $PSScriptRoot\..

docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker failed. Is Docker Desktop running?" -ForegroundColor Red
    exit 1
}

Write-Host "Waiting for database to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

Write-Host "Running migrations..." -ForegroundColor Cyan
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration failed. Check that DATABASE_URL in .env points to postgresql://postgres:postgres@localhost:5432/jobportal" -ForegroundColor Red
    exit 1
}

Write-Host "Done. Start the app with: cd apps\web; npm run dev" -ForegroundColor Green
