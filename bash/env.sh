#!/usr/bin/env bash

export is_www_dockerized=0

# if this is the dockerized setup, uncomment here
# is_www_dockerized=1

export npm_www_dockercompose_service_name=php

# if this is the dockerized setup
# if you mapped www catalog to a dockerized volume, having npm install, 
# here must be set the catalog full path = volume path, mapped inside docker compose service, having npm
export npm_www_dockercompose_volume_inner_mapped_path="/var/www"


export current_catalog="$(dirname "$(realpath "$0")")"
#echo "${current_catalog}"

export projectRoot="$(realpath "${current_catalog}/../")"

if [[ $is_www_dockerized = 1 ]]; then
  export https_service_docker_volume="${npm_www_dockercompose_volume_inner_mapped_path}"
  export dockercompose_index_catalog="${projectRoot}"
else
  export https_service_docker_volume="$(realpath "${projectRoot}/https_service_docker_volume")"
  #echo "${https_service_docker_volume}"
fi

