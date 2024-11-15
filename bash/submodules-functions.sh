#!/bin/bash

# Define an array of submodules you want to link/unlink
submodules=( "EventEmitter" "Template" )


export current_catalog="$(dirname "$(realpath "$0")")"
source "${current_catalog}/exports.sh"

echo "${npm_index_catalog}"
echo "$(ls -la "${npm_index_catalog}")"


# Link all submodules
link_submodules() {
  echo "Linking submodules..."
  for submodule in "${submodules[@]}"; do
    (
      cd "${npm_index_catalog}/src/modules"
      cd "$submodule" || exit

      echo "npm install in $submodule..."
      npm install

      echo "building $submodule..."
      npm run build

      for submodule_level_2 in "${submodules[@]}"; do
        (
          cd "${npm_index_catalog}/src/modules"
          cd "$submodule" || exit

          echo "Linking $submodule_level_2 in $submodule..."
          npm link
        )
      done
    )
  done
}
# "build:all": "npm run build -w src/EventEmitter && npm run build -w src/TemplatesRenderer"

# Unlink all submodules
unlink_submodules() {
  echo "Unlinking submodules from main project..."
  for submodule in "${submodules[@]}"; do
    module_name=$(node -p "require('$submodule/package.json').name")  # Extracts name from package.json
    npm unlink "$module_name"
  done
  echo "Unlinking completed."
}

npm_install_submodules() {
  echo "Building submodules..."
  for submodule in "${submodules[@]}"; do
    (
      cd "${npm_index_catalog}/src/modules"
      cd "$submodule" || exit
      echo "npm install in $submodule..."
      npm install
    )
  done
}

# Build all submodules
build_submodules() {
  echo "Building submodules..."
  for submodule in "${submodules[@]}"; do
    (
      cd "${npm_index_catalog}/src/modules"
      cd "$submodule" || exit
      echo "building $submodule..."
      npm run build
    )
  done
}


# Install main project dependencies and build with tsc
test_main_project() {
  echo "Running npm install in main project..."
  npm install
  echo "Running TypeScript compilation..."
  npx tsc -p tsconfig.prod.json  # Replace with appropriate tsconfig file for testing
}

# Full workflow
run_full_workflow() {
  link_submodules               # Step 1: Link submodules
  echo "Testing linked setup..." 
  npx tsc -p tsconfig.dev.json   # Optional: Development testing
  
  unlink_submodules              # Step 2: Unlink all submodules for npm testing
  test_main_project              # Step 3: Run npm install and test main project with npm-installed modules
}

# Run the full workflow
# run_full_workflow

