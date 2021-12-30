#!/bin/sh
set -o xtrace
exec nyc --reporter=lcov --reporter=text npm run test
