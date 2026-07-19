# One-off helper used to generate placeholder SVG images during initial
# site setup. Not needed for day-to-day site maintenance. See
# docs/ADDING_PRODUCTS.md for how to add real product photos instead.

$products = @(
  @{ file = "classic-faux-wood.svg";     label = "Classic Faux Wood Blinds" },
  @{ file = "premium-aluminum.svg";      label = "Premium Aluminum Blinds" },
  @{ file = "vertical-sliding-door.svg"; label = "Vertical Blinds" },
  @{ file = "cordless-blinds.svg";       label = "Cordless Blinds" },
  @{ file = "motorized-smart.svg";       label = "Motorized Smart Blinds" },
  @{ file = "room-darkening.svg";        label = "Room-Darkening Blinds" },
  @{ file = "genuine-wood.svg";          label = "Genuine Wood Blinds" },
  @{ file = "mini-blinds.svg";           label = "Mini Blinds" },
  @{ file = "two-tone-blinds.svg";       label = "Two-Tone Decorative Blinds" }
)

$outDir = Join-Path $PSScriptRoot "..\assets\images\products"

function New-PlaceholderSvg($label) {
  $words = $label -split ' '
  $mid = [Math]::Ceiling($words.Length / 2)
  $line1 = ($words[0..($mid - 1)] -join ' ')
  $line2 = ($words[$mid..($words.Length - 1)] -join ' ')

  @"
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <rect width="640" height="480" fill="#E4EFE3"/>
  <rect x="24" y="24" width="592" height="432" fill="none" stroke="#A9CAAE" stroke-width="2" stroke-dasharray="10 8"/>
  <g fill="#4C7A63" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
    <text x="320" y="230" font-size="30" font-weight="700">$line1</text>
    <text x="320" y="270" font-size="30" font-weight="700">$line2</text>
  </g>
  <text x="320" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#2F4E3D">Product photo placeholder. Replace me</text>
</svg>
"@
}

foreach ($p in $products) {
  $svg = New-PlaceholderSvg $p.label
  $path = Join-Path $outDir $p.file
  Set-Content -Path $path -Value $svg -Encoding utf8
  Write-Output "Created $path"
}
