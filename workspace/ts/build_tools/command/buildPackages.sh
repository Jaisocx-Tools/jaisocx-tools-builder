#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

echo "\$projectRoot"
echo $projectRoot

tsconfigVersion="$1"
cd "${projectRoot}/build_tools/ProjectBuilder" 

commands_array=(
  "cd \"${dockerWorkingDir}/build_tools/ProjectBuilder\""
  "export NODE_OPTIONS=\"--no-warnings\""
  "node \"./build/${tsconfigVersion}/index.js\" --ProjectRoot=\"${dockerWorkingDir}\" --BuildData=\"./BuildData.json\" --PackagesPath=\"./www/\""
)

commands_concatenated=$(printf " && %s" "${commands_array[@]}")
commands_concatenated=${commands_concatenated:4}

docker compose exec node /usr/bin/env bash -c "${commands_concatenated}"

