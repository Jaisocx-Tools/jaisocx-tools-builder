#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

echo "\$projectRoot"
echo $projectRoot

tsconfigVersion="$1"
cd "${https_service_docker_volume}/build_tools/ProjectBuilder" 
node "./build/${tsconfigVersion}/index.js" --ProjectRoot="${projectRoot}" --BuildData="./BuildData.json" --PackagesPath="./www/"

