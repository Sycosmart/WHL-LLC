# One-off helper: crops the deer+curtain icon out of the full logo
# lockup (assets/images/logo/New WHL logo .jpg) for use in the compact
# header/favicon, where the full logo's small text wouldn't be legible.
# Not needed for day-to-day site maintenance.

Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\assets\images\logo\whl-logo-full.jpg"
$outPath = Join-Path $PSScriptRoot "..\assets\images\logo\whl-icon.png"

# Crop rectangle, tuned by eye against the 1024x1024 source image.
$rect = New-Object System.Drawing.Rectangle(200, 235, 630, 560)
$cream = [System.Drawing.Color]::FromArgb(255, 251, 247, 234) # matches --color-cream

$src = [System.Drawing.Image]::FromFile($srcPath)

# Pad to a square canvas (same cream as the logo's own background) so the
# icon also works cleanly as a favicon.
$size = [Math]::Max($rect.Width, $rect.Height)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear($cream)
$offsetX = [Math]::Floor(($size - $rect.Width) / 2)
$offsetY = [Math]::Floor(($size - $rect.Height) / 2)
$destRect = New-Object System.Drawing.Rectangle($offsetX, $offsetY, $rect.Width, $rect.Height)
$g.DrawImage($src, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Output "Saved icon crop to $outPath"
