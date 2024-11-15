#!/usr/bin/env bash

export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/exports.sh"

echo "${npm_index_catalog}"
echo "$(ls -la "${npm_index_catalog}")"


if [[ $is_www_dockerized = 1 ]]; then
  cd "${dockercompose_index_catalog}"
  docker compose exec "${npm_www_dockercompose_service_name}" /usr/bin/env bash -c 'npm install'
  docker compose exec "${npm_www_dockercompose_service_name}" /usr/bin/env bash -c 'npm --prefix "${npm_index_catalog}/build_tools" install'
  docker compose exec "${npm_www_dockercompose_service_name}" /usr/bin/env bash -c 'npm --prefix "${npm_index_catalog}/build_tools" run build'
else
  cd "${npm_index_catalog}"
  npm install
  npm --prefix ./build_tools install
  npm --prefix ./build_tools run build
fi

