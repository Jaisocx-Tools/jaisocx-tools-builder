#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

cd "${https_service_docker_volume}"
node ./build_tools/build/ProjectBuilder/build.js --projectRoot="${projectRoot}"

