

$root = Join-Path (Get-Location) "wwwroot"


$files = Get-ChildItem -Path $root -Recurse -File

$filesToCommit = @()

foreach ($file in $files) {
    $dir = $file.DirectoryName
    $lowerName = $file.Name.ToLower()

    if ($file.Name -ne $lowerName) {
        $tempName = [System.IO.Path]::Combine($dir, "temp_" + $lowerName)
        

        git mv $file.FullName $tempName

        $finalName = [System.IO.Path]::Combine($dir, $lowerName)
        git mv $tempName $finalName

        $filesToCommit += $finalName
    }
}

if ($filesToCommit.Count -gt 0) {
    git commit -m "Fix filenames case: converted all files in wwwroot to lowercase"
    Write-Host "all fails in wwwroot come to lowercase and commit!"
} else {
    Write-Host "all fails in lowercase"
}

