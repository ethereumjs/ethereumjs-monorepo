
const fetch = require('node-fetch')

// This manifest file is used on the official GH Action Node-versions.
// It contains the node versions available for use.
const GITHUB_VERSIONS_MANIFEST_URL = "https://raw.githubusercontent.com/actions/node-versions/main/versions-manifest.json"

// NodeJS Release schedule JSON
const NODEJS_RELEASE_SCHEDULE_URL = "https://raw.githubusercontent.com/nodejs/Release/master/schedule.json"

// Use current, active and deprecated versions up to Six months ago
const MONTHS = 6
const TODAY_WITH_SOME_TOLERANCE = (new Date(Date.now() - MONTHS * 30 * 24 * 60 * 60 * 1000)).toISOString();

(async () => {
  try {

    // GitHub Actions available Node versions for testing
    const req1 = await fetch(GITHUB_VERSIONS_MANIFEST_URL)
    let availableVersions = await req1.json()
    availableVersions = [...new Set(availableVersions.map(e => parseInt(e.version, 10)).sort())]

    // Node JS release schedule
    const req2 = await fetch(NODEJS_RELEASE_SCHEDULE_URL)
    const allReleases = await req2.json()

    const activeVersions = []
    Object.keys(allReleases).forEach(e => {
      if (allReleases[e].end > TODAY_WITH_SOME_TOLERANCE) {
        activeVersions.push(parseInt(e.replace(/^v/, ''), 10))
      }
    })

    process.stdout.write(JSON.stringify(activeVersions.filter(e => availableVersions.includes(e))))

  } catch (error) {
    console.log(error)
  }
})()
