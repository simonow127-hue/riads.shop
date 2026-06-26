# Push backend and frontend to separate GitHub repos
# Requires: Git for Windows + GitHub auth (PAT or gh auth login)

$ErrorActionPreference = "Stop"

$gitCandidates = @(
  "git",
  "${env:ProgramFiles}\Git\cmd\git.exe",
  "${env:ProgramFiles(x86)}\Git\cmd\git.exe",
  "${env:LOCALAPPDATA}\Programs\Git\cmd\git.exe"
)

$git = $null
foreach ($c in $gitCandidates) {
  if ($c -eq "git") {
    $cmd = Get-Command git -ErrorAction SilentlyContinue
    if ($cmd) { $git = $cmd.Source; break }
  } elseif (Test-Path $c) {
    $git = $c
    break
  }
}

if (-not $git) {
  Write-Host "Git not found. Install from https://git-scm.com/download/win then run this script again." -ForegroundColor Red
  exit 1
}

Write-Host "Using: $git" -ForegroundColor Green

function Push-Repo {
  param(
    [string]$Path,
    [string]$RemoteUrl,
    [string]$Name
  )

  Write-Host "`n=== $Name ===" -ForegroundColor Cyan
  Push-Location $Path

  if (-not (Test-Path ".git")) {
    & $git init -b main
  }

  if (-not (Test-Path ".gitignore")) {
    Write-Host "Warning: no .gitignore in $Path" -ForegroundColor Yellow
  }

  & $git add -A
  $status = & $git status --porcelain
  if ($status) {
    & $git commit -m "Initial commit: Riads $Name"
  } else {
    Write-Host "No changes to commit." -ForegroundColor Gray
  }

  $remotes = & $git remote 2>$null
  if ($remotes -notcontains "origin") {
    & $git remote add origin $RemoteUrl
  } else {
    & $git remote set-url origin $RemoteUrl
  }

  & $git push -u origin main
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. Log in to GitHub (gh auth login or Git Credential Manager), then retry." -ForegroundColor Red
    Write-Host "If the repo has a README already: git pull origin main --allow-unrelated-histories" -ForegroundColor Yellow
    Pop-Location
    exit $LASTEXITCODE
  }

  Write-Host "$Name pushed to $RemoteUrl" -ForegroundColor Green
  Pop-Location
}

$root = Split-Path $PSScriptRoot -Parent

Push-Repo -Path "$root\backend" -RemoteUrl "https://github.com/simonow127-hue/backend.git" -Name "backend"
Push-Repo -Path "$root\frontend" -RemoteUrl "https://github.com/simonow127-hue/frontend.git" -Name "frontend"

Write-Host "`nDone." -ForegroundColor Green
