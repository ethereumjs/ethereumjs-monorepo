#!/usr/bin/env bash

usage() {
    echo 'Usage: ./diffTester.sh [-a branch1] [-b branch2] [-t "path/to/my/test.json"] [-r 5] [-f London]'
}

FORK="London"

while getopts "a:b:t:r:f::" c
do
    case $c in
        a) BRANCH1=$OPTARG ;;
        b) BRANCH2=$OPTARG ;; 
        t) TEST=$OPTARG ;;
        r) REPS=$OPTARG ;;
        f) FORK=$OPTARG ;;
        h|?) usage ;;
    esac
done

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

git stash

git checkout $BRANCH1

npm run tester -- --state --fork=$FORK --customStateTest=$TEST --reps=$REPS

git checkout $BRANCH2

npm run tester -- --state --fork=$FORK --customStateTest=$TEST --reps=$REPS

git checkout $CURRENT_BRANCH 

git stash pop