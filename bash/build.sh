#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/env.sh"

# echo "${https_service_docker_volume}"
# echo "$(ls -la "${https_service_docker_volume}")"


if [ $is_www_dockerized = 1 ]; then
  cd "${dockercompose_index_catalog}"
  docker compose exec "${npm_www_dockercompose_service_name}" /usr/bin/env bash -c 'npm --prefix "${npm_index_catalog}/build_tools" run build'
else
# here the build with ts transpler without webpack, better
  cd "${https_service_docker_volume}"
  node ./build_tools/build/ProjectBuilder/build.js --projectRoot="${projectRoot}"
fi

