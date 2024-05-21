set -Eeo pipefail

cd $(dirname $0)/..

echo "Building..."
tinygo build -o=yamlfmt.wasm -target=wasm -no-debug ./src/lib.go

echo "Generating JS..."
cp $(tinygo env TINYGOROOT)/targets/wasm_exec.js ./yamlfmt.js
git apply ./yamlfmt.patch

./scripts/package.mjs ./package.json
