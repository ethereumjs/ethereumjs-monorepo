#!/bin/sh
set -o xtrace
exec c8 --all --reporter=lcov --reporter=text npm run test
