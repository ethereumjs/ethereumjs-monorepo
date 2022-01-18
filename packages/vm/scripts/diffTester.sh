#!/bin/sh

usage() {
    echo 'Usage: ./diffTester.sh [-b branch] [-t "path/to/my/test.json"] [-r 5] [-f London]'
}

FORK="London"

while getopts "b:t:r:f::" c
do
    case $c in
        b) BRANCH=$OPTARG ;;
        t) TEST=$OPTARG ;;
        r) REPS=$OPTARG ;;
        f) FORK=$OPTARG ;;
        h|?) usage ;;
    esac
done

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

git stash

git checkout $BRANCH

npm run tester -- --state --fork=$FORK --customStateTest=$TEST --reps=$REPS

git checkout $CURRENT_BRANCH

npm run tester -- --state --fork=$FORK --customStateTest=$TEST --reps=$REPS

git stash pop