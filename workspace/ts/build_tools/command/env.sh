#!/usr/bin/env bash

export is_dockerized=1

export current_catalog="$(dirname "$(realpath "$0")")"
export projectRoot="$(realpath "${current_catalog}/../../")"

if [[ $is_dockerized = 1 ]]; then
  export dockerWorkingDir="/var/www/workspace/ts"
fi

