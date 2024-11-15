#!/usr/bin/env bash

script_arg="${1}"
script_arg_name="--catalog_to_check"
catalog_to_check="./www/examples/ExampleTemplate/dist-simple"

## plugin install command
## to reference the catalog, where package.json resides, with the eslint module .js files

## when at npm registry
# npm install eslint-plugin-jaisocx:1.0.01 --save-dev
# npm link eslint-plugin-jaisocx


clear
echo ""
echo "AUTHOR: ELIAS POLIANSKYI"
echo ""
echo "SCRIPT RUNNING: "$0""
echo "ESLINT SCRIPT STARTED ..."

export current_catalog="$(dirname "$(realpath "$0")")"
# source "${current_catalog}/exports.sh"

export eslint_catalog="$(realpath "${current_catalog}/../https_service_docker_volume")"
echo ""
echo "THE ESLINT CONFIG CATALOG: ${eslint_catalog}"
echo "$(ls -la "${eslint_catalog}")"


echo ""
echo "changing terminal path to "${eslint_catalog}""
cd "${eslint_catalog}"

echo ""
echo "THE ESLINTED CATALOG: ${catalog_to_check}"
echo "$(ls -la "${catalog_to_check}")"


#echo ""
#echo "changing root to "${current_catalog}""
#cd "${current_catalog}"
#exit 123


# eslint check block 
echo ""
echo "changing terminal path to "${eslint_catalog}""
cd "${eslint_catalog}"

echo ""
echo "Eslint check starting ..."
npx eslint "${catalog_to_check}" --fix
echo "Eslint check finished"

echo ""
echo "changing terminal path to "${current_catalog}""
cd "${current_catalog}"
exit 0


# eslint fix block
npx eslint "${catalog_to_check}" --fix






