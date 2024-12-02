#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

echo "\$projectRoot"
echo $projectRoot

tsconfigVersion="$1"
cd "${projectRoot}" 

commands_array=(
  "cd \"${dockerWorkingDir}/build_tools/ProjectBuilder\""
  "export NODE_OPTIONS=\"--no-warnings\""
  "npx tsc -p \"./tsconfig.ESNext.overrides.json\""
  "npx tsc -p \"./tsconfig.CommonJS.overrides.json\""
  "npx babel \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/CommonJS\" --out-dir \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/Babel\" --extensions \".js\""
  "npx cpx \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/CommonJS/**/*.d.ts\" \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/Babel/\""
  "npx cpx \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/CommonJS/**/*.map\" \"${dockerWorkingDir}/build_tools/ProjectBuilder/build/Babel/\""
)

commands_concatenated=$(printf " && %s" "${commands_array[@]}")
commands_concatenated=${commands_concatenated:4}

docker compose exec node /usr/bin/env bash -c "${commands_concatenated}"

