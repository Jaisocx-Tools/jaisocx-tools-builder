#!/usr/bin/env bash

tsconfigVersion="ESNext"
bash ./workspace/ts/build_tools/command/buildProjectBuilder.sh "${tsconfigVersion}"

tsconfigVersion="CommonJS"
bash ./workspace/ts/build_tools/command/buildProjectBuilder.sh "${tsconfigVersion}"

