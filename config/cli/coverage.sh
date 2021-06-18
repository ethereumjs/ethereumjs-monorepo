#!/bin/sh
set -o xtrace
exec nyc npm run test && exec nyc report --reporter=text-lcov > .nyc_output/lcov.info
