$files = Get-ChildItem -Path . -Filter *.html
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    # Replace navbar logo
    $navbarRegex = '(?s)<a href="index\.html" class="text-2xl font-bold cursor-pointer flex items-center gap-2 no-underline z-10">\s*<div class="bg-blue-500 p-1\.5 rounded-lg text-white">\s*<i data-lucide="zap" size="24" fill="currentColor"></i>\s*</div>\s*<span class="text-slate-900">DigitWeb</span>\s*</a>'
    
    $newNavbar = '<a href="index.html" class="cursor-pointer flex items-center z-10">
                    <img src="Image/Logo.png" alt="Veltrix Solutions Logo" class="h-10 w-auto">
                </a>'
    
    $content = $content -replace $navbarRegex, $newNavbar

    # Replace footer logo
    $footerRegex = '<a href="index\.html" class="text-2xl font-bold text-white mb-6 block hover:text-blue-400 transition-colors">DigitWeb</a>'
    
    $newFooter = '<a href="index.html" class="mb-6 block inline-block">
                    <img src="Image/Logo.png" alt="Veltrix Solutions Logo" class="h-12 w-auto">
                </a>'

    $content = $content -replace $footerRegex, $newFooter

    # Replace names
    $content = $content.Replace("DigitWeb Solution Agency", "Veltrix Solutions")
    $content = $content.Replace("DigitWeb Solution", "Veltrix Solutions")
    $content = $content.Replace("DigitWeb", "Veltrix")

    # Set content back
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
Write-Output "Done"
