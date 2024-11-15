#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/exports.sh"

echo "${npm_index_catalog}"
echo "$(ls -la "${npm_index_catalog}")"

cd src/EventEmitter
npm publish --registry https://your-registry-url

cd -
cd src/EventEmitter
npm publish --registry https://your-registry-url

# npx tsc -p tsconfig.test.json
# npx eslint . --fix

