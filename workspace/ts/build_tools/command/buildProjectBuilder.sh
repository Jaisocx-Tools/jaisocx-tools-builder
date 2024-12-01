#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

echo "\$projectRoot"
echo $projectRoot

tsconfigVersion="$1"
cd "${projectRoot}/build_tools/ProjectBuilder" 
docker compose exec node /usr/bin/env bash -c "cd \"${dockerWorkingDir}/build_tools/ProjectBuilder\" && npm run build:${tsconfigVersion}"

