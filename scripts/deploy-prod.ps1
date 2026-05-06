param(
    [string]$HostName = '114.132.251.50',
    [string]$UserName = 'ubuntu',
    [string]$RemoteDir = '/home/yzb',
    [string]$JdkHome = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot',
    [string]$SshPassword = '',
    [string]$SudoPassword = '',
    [switch]$SkipFrontendBuild,
    [switch]$SkipBackendBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-Step {
    param(
        [string]$Message,
        [scriptblock]$Action
    )

    Write-Host "==> $Message" -ForegroundColor Cyan
    & $Action
}

function Resolve-CommandPath {
    param(
        [string]$CommandName,
        [string]$FallbackPath = ''
    )

    $command = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    if ($FallbackPath -and (Test-Path $FallbackPath)) {
        return $FallbackPath
    }

    throw "Required command was not found: $CommandName"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $repoRoot 'yzb-qd'
$backendDir = Join-Path $repoRoot 'yzb-hd'
$artifactDir = Join-Path $repoRoot '.deploy'
$composeSource = Join-Path $repoRoot 'docker\docker-compose.yml'
$nginxSource = Join-Path $frontendDir 'nginx.conf'
$sqlSource = Join-Path $backendDir 'sql\20260506_add_status_columns.sql'
$remoteScriptSource = Join-Path $PSScriptRoot 'prod-remote-deploy.sh'
$sshHelperSource = Join-Path $PSScriptRoot 'remote_ssh.py'
$venvPython = Join-Path $repoRoot '.venv\Scripts\python.exe'
$pythonCommand = if (Test-Path $venvPython) { $venvPython } else { Resolve-CommandPath -CommandName 'python.exe' }
$npmCommand = Resolve-CommandPath -CommandName 'npm.cmd'
$mavenCommand = Resolve-CommandPath -CommandName 'mvn.cmd'
$sshCommand = Resolve-CommandPath -CommandName 'ssh.exe'
$scpCommand = Resolve-CommandPath -CommandName 'scp.exe'

if (-not $SshPassword -and $env:YZB_DEPLOY_SSH_PASSWORD) {
    $SshPassword = $env:YZB_DEPLOY_SSH_PASSWORD
}

if (-not $SudoPassword) {
    if ($env:YZB_DEPLOY_SUDO_PASSWORD) {
        $SudoPassword = $env:YZB_DEPLOY_SUDO_PASSWORD
    }
    elseif ($SshPassword) {
        $SudoPassword = $SshPassword
    }
}

if (-not (Test-Path $frontendDir)) {
    throw 'Frontend directory yzb-qd was not found.'
}

if (-not (Test-Path $backendDir)) {
    throw 'Backend directory yzb-hd was not found.'
}

if (-not (Test-Path $composeSource)) {
    throw 'docker/docker-compose.yml was not found.'
}

if (-not (Test-Path $nginxSource)) {
    throw 'Frontend nginx.conf was not found.'
}

if (-not (Test-Path $sqlSource)) {
    throw 'Database migration script was not found.'
}

if (-not (Test-Path $remoteScriptSource)) {
    throw 'Remote deploy script template was not found.'
}

if (-not (Test-Path $sshHelperSource)) {
    throw 'SSH helper script was not found.'
}

if (-not $SkipBackendBuild -and -not (Test-Path $JdkHome)) {
    throw "JDK 21 directory was not found: $JdkHome"
}

New-Item -ItemType Directory -Force -Path $artifactDir | Out-Null
Get-ChildItem -Path $artifactDir -Force | Remove-Item -Recurse -Force

if (-not $SkipFrontendBuild) {
    Invoke-Step 'Build frontend dist' {
        Push-Location $frontendDir
        try {
            & $npmCommand run build
        }
        finally {
            Pop-Location
        }
    }
}

if (-not $SkipBackendBuild) {
    Invoke-Step 'Build backend jar' {
        $env:JAVA_HOME = $JdkHome
        $env:Path = "$JdkHome\bin;$env:Path"
        Push-Location $backendDir
        try {
            & $mavenCommand -DskipTests package
        }
        finally {
            Pop-Location
        }
    }
}

$jarFile = Get-ChildItem -Path (Join-Path $backendDir 'target') -Filter *.jar |
    Where-Object { $_.Name -notmatch 'sources|javadoc|original' } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $jarFile) {
    throw 'No deployable backend jar file was found.'
}

$distDir = Join-Path $frontendDir 'dist'
if (-not (Test-Path $distDir)) {
    throw 'Frontend dist directory was not found. Run the frontend build first.'
}

Invoke-Step 'Prepare deployment artifacts' {
    Copy-Item $composeSource (Join-Path $artifactDir 'docker-compose.yml') -Force
    Copy-Item $nginxSource (Join-Path $artifactDir 'nginx.conf') -Force
    Copy-Item $sqlSource (Join-Path $artifactDir '20260506_add_status_columns.sql') -Force
    Copy-Item $remoteScriptSource (Join-Path $artifactDir 'remote-deploy.sh') -Force
    Copy-Item $jarFile.FullName (Join-Path $artifactDir 'yzb.jar') -Force

    $distArchive = Join-Path $artifactDir 'frontend-dist.tar.gz'
    if (Test-Path $distArchive) {
        Remove-Item $distArchive -Force
    }
    & tar -czf $distArchive -C $frontendDir dist
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to archive the frontend dist directory.'
    }
}

Invoke-Step 'Upload artifacts to server' {
    $uploadSources = @(
        (Join-Path $artifactDir 'docker-compose.yml')
        (Join-Path $artifactDir 'nginx.conf')
        (Join-Path $artifactDir 'yzb.jar')
        (Join-Path $artifactDir 'frontend-dist.tar.gz')
        (Join-Path $artifactDir '20260506_add_status_columns.sql')
        (Join-Path $artifactDir 'remote-deploy.sh')
    )

    if ($SshPassword) {
        & $pythonCommand $sshHelperSource --host $HostName --username $UserName --password $SshPassword mkdir --path "${RemoteDir}/.deploy"
        if ($LASTEXITCODE -ne 0) {
            throw 'Failed to create the remote deployment directory.'
        }

        $uploadArgs = @(
            $sshHelperSource
            '--host'
            $HostName
            '--username'
            $UserName
            '--password'
            $SshPassword
            'upload'
            '--remote-dir'
            "${RemoteDir}/.deploy"
        )

        foreach ($uploadSource in $uploadSources) {
            $uploadArgs += '--local-file'
            $uploadArgs += $uploadSource
        }

        & $pythonCommand @uploadArgs
        if ($LASTEXITCODE -ne 0) {
            throw 'Failed to upload deployment artifacts.'
        }
    }
    else {
        & $sshCommand "${UserName}@${HostName}" "mkdir -p ${RemoteDir}/.deploy"
        if ($LASTEXITCODE -ne 0) {
            throw 'Failed to create the remote deployment directory.'
        }

        & $scpCommand @uploadSources "${UserName}@${HostName}:${RemoteDir}/.deploy/"
        if ($LASTEXITCODE -ne 0) {
            throw 'Failed to upload deployment artifacts.'
        }
    }
}

Invoke-Step 'Run remote deployment script' {
    if ($SshPassword) {
        $remoteCommand = "chmod +x ${RemoteDir}/.deploy/remote-deploy.sh && bash ${RemoteDir}/.deploy/remote-deploy.sh"
        & $pythonCommand $sshHelperSource --host $HostName --username $UserName --password $SshPassword run --command-text $remoteCommand --sudo-password $SudoPassword
        if ($LASTEXITCODE -ne 0) {
            throw 'Remote deployment failed.'
        }
    }
    else {
        & $sshCommand "${UserName}@${HostName}" "chmod +x ${RemoteDir}/.deploy/remote-deploy.sh && sudo bash ${RemoteDir}/.deploy/remote-deploy.sh"
        if ($LASTEXITCODE -ne 0) {
            throw 'Remote deployment failed.'
        }
    }
}

Write-Host 'Deployment completed.' -ForegroundColor Green