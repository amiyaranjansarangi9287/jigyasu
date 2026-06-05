pnpm --filter @jigyasu/hub... build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    exit $LASTEXITCODE
}

rm -r .vercel/output -Force -ErrorAction SilentlyContinue
mkdir -p .vercel/output/static | Out-Null
cp -r apps/hub/dist/* .vercel/output/static/
cp .vercel/output/static/index.html .vercel/output/static/404.html

# Write config.json with UTF-8 NoBOM
$configJson = '{"version": 3, "routes": [{"handle": "filesystem"}, {"src": "^/(.*)", "dest": "/index.html"}]}'
[System.IO.File]::WriteAllText("$PWD\.vercel\output\config.json", $configJson, [System.Text.Encoding]::UTF8)

npx vercel deploy --prebuilt --prod -y
