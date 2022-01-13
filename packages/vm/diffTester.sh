#!/usr/bin/env bash

git checkout $1

npm run tester -- --state --fork="London" --customStateTest="../../../performance_state_tests/jumpdest_analysis/jd_attack_london_10MGas_JUMPDEST_250M.json" --reps=5

git checkout $2

npm run tester -- --state --fork="London" --customStateTest="../../../performance_state_tests/jumpdest_analysis/jd_attack_london_10MGas_JUMPDEST_250M.json" --reps=5