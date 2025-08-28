# Configuration
$projectName = "al-dalil-guide"
$buildDir = "out"
$maxFileSize = 25MB

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Cyan
if (Test-Path $buildDir) {
    Remove-Item -Path $buildDir -Recurse -Force
}

# Build the application
Write-Host "🏗️  Building Next.js application..." -ForegroundColor Cyan
pnpm run build

# Check if build was successful
if (-not (Test-Path $buildDir)) {
    Write-Host "❌ Build failed: $buildDir directory not found" -ForegroundColor Red
    exit 1
}

# Check for large files
Write-Host "🔍 Checking for large files..." -ForegroundColor Cyan
$largeFiles = Get-ChildItem -Path $buildDir -Recurse -File | Where-Object { $_.Length -gt $maxFileSize }

if ($largeFiles.Count -gt 0) {
    Write-Host "❌ The following files exceed the 25MB limit:" -ForegroundColor Red
    foreach ($file in $largeFiles) {
        $size = "{0:N2} MB" -f ($file.Length / 1MB)
        Write-Host "    $($file.FullName) ($size)" -ForegroundColor Yellow
    }
    exit 1
}

# Deploy to Cloudflare Pages
Write-Host "🚀 Deploying to Cloudflare Pages..." -ForegroundColor Cyan
npx wrangler pages deploy $buildDir --project-name=$projectName

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
