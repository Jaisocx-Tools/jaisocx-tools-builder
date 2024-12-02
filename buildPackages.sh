#!/usr/bin/env bash

# this variable sets, what ProjectBuilder compiled version will be called.
# ESNext is preferred, when You have the Node version 23.3 and above, since this ESNext build was done with Node v23.3.0
tsconfigVersion="ESNext"

bash ./workspace/ts/build_tools/command/buildPackages.sh "${tsconfigVersion}"

