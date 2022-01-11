#!/bin/sh
set -o xtrace
exec nyc --reporter=lcov --reporter=text --reporter=nyc-report-lcov-absolute npm run test
