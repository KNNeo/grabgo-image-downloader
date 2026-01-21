param(
    [string]$FullUrl
)
# ---- Check if BurntToast is available ----
if (-not (Get-Module -ListAvailable -Name BurntToast)) {
    Write-Host "Notifications may not display, continuing..."
    Start-Sleep -Seconds 3
}

Import-Module BurntToast -ErrorAction SilentlyContinue

# ---- DEBUG START ----
Write-Host "---- DEBUG START ----"
Write-Host "Full URL: $FullUrl"

# Strip surrounding quotes (Windows sometimes adds them)
$FullUrl = $FullUrl.Trim('"')

# Extract query string (everything after ?)
$Query = $FullUrl -replace '^.*\?', ''
Write-Host "Query string: $Query"

# Parse query parameters
$params = @{}

$Query -split '&' | ForEach-Object {
    $pair = $_ -split '=', 2
    if ($pair.Count -eq 2) {
        $key = $pair[0]
        $val = [System.Uri]::UnescapeDataString($pair[1])
        $params[$key] = $val
    }
}

$url  = $params['url']
$name = $params['name']
$user = $params['user']

Write-Host "Decoded URL:  $url"
Write-Host "Decoded Name: $name"
Write-Host "Decoded User: $user"

# Sanitize filesystem inputs
$name = [System.IO.Path]::GetFileName($name)
$user = [System.IO.Path]::GetFileName($user)

# Target path
$TargetRoot = ""
$TargetDir  = Join-Path $TargetRoot $user
$OutFile    = Join-Path $TargetDir $name

Write-Host "Target file: $OutFile"

# Ensure drive and user directory exist
if (-not (Test-Path -PathType Container $TargetRoot)) {
    New-Item -Path $TargetRoot -ItemType Directory -Force | Out-Null
}

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir | Out-Null
}

# Prevent overwrite
if (Test-Path $OutFile) {
    Write-Host "File already exists"
    New-BurntToastNotification -Text "Save to $user failed", "File already exists: $name" -Sound Default -ExpirationTime (Get-Date).AddSeconds(5) -AppLogo null
    exit 1
}

# Download atomically
$tmp = [System.IO.Path]::GetTempFileName()

try {
    Invoke-WebRequest -Uri $url -OutFile $tmp -ErrorAction Stop
    Move-Item $tmp $OutFile -ErrorAction Stop
    Write-Host "Saved: $OutFile"
    New-BurntToastNotification -Text "Save to $user", $name -Sound Default -ExpirationTime (Get-Date).AddSeconds(5) -AppLogo null
}
catch {
    if (Test-Path $tmp) { Remove-Item $tmp -Force }
    Write-Host "Download failed"
    New-BurntToastNotification -Text "Save to $user failed", "Try again. $name" -Sound Default -AppLogo null
    exit 1
}

Write-Host "---- DEBUG END ----"
