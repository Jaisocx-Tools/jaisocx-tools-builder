#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

echo "\$projectRoot"
echo $projectRoot

tsconfigVersion="$1"
cd "${projectRoot}" 
docker compose exec node /usr/bin/env bash -c "cd \"${dockerWorkingDir}/build_tools/ProjectBuilder\" && export NODE_OPTIONS="--no-warnings" && npx tsc -p \"./tsconfig.ESNext.overrides.json\" && npx tsc -p \"./tsconfig.CommonJS.overrides.json\" && npx babel \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/CommonJS\" --out-dir \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/Babel\" --extensions \".js\""

