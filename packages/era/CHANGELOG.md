# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.0.0-dev-rc.1 - 2025-03-24

Initial development release

Features:

- Export history data as Era1
- Read Era1 files which store pre-merge execution layer block history in 8192 block increments (i.e. eras)
- Read Era files which store SSZ encoded signed beacon blocks by era (8192 blocks)

Note: This library is still **experimental** and the API might change along minor release versions!