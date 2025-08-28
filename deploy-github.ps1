# Create a CNAME file for GitHub Pages
$cnameContent = "al-dalil-app.github.io"
$cnamePath = Join-Path -Path $PSScriptRoot -ChildPath "docs\CNAME"
Set-Content -Path $cnamePath -Value $cnameContent

# Create a README.md if it doesn't exist
$readmePath = Join-Path -Path $PSScriptRoot -ChildPath "README.md"
if (-not (Test-Path $readmePath)) {
    $readmeContent = "# Al-Dalil App

This is the Al-Dalil application deployed to GitHub Pages.

## Development

To run the development server:

\`\`\`bash
npm run dev
\`\`\`

## Build

To create a production build:

\`\`\`bash
npm run build
\`\`\`

## Deployment

This site is automatically deployed to GitHub Pages from the `docs` directory."
    Set-Content -Path $readmePath -Value $readmeContent
}

Write-Host "✅ GitHub Pages setup complete!" -ForegroundColor Green
Write-Host "1. Create a new repository on GitHub (e.g., 'al-dalil-app')"
Write-Host "2. Run these commands to push your code:"
Write-Host "   cd "$PSScriptRoot""
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial commit'"
Write-Host "   git branch -M main"
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git"
Write-Host "   git push -u origin main"
Write-Host "3. Go to your repository settings on GitHub"
Write-Host "4. Select 'Pages' from the left sidebar"
Write-Host "5. Under 'Source', select 'Deploy from a branch'"
Write-Host "6. Under 'Branch', select 'main' and '/docs' as the folder"
Write-Host "7. Click 'Save'"
Write-Host "8. Your site will be available at: https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/"
