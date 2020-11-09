#!/bin/node
const https = require("https")

// This manifest file is used on the official GH Action Node-versions.
// It contains the node versions available for use.
const GITHUB_VERSIONS_MANIFEST_URL = "https://raw.githubusercontent.com/actions/node-versions/main/versions-manifest.json"

https.get(GITHUB_VERSIONS_MANIFEST_URL, (response) => {
    if (response.statusCode !== 200) {
        throw response.statusCode
    }
    
    let rawData = '';
    response.on('data', (chunk) => { rawData += chunk; });
    response.on('end', () => {
        try {
            const versions = JSON.parse(rawData);
            const versionList = {
                // We only want the major versions
                node: [...new Set(versions.map(e => parseInt(e.version, 10)).sort())]
            }
            process.stdout.write(JSON.stringify(versionList));
        } catch (e) {
            process.stderr.write(e.message);
        }
    });
})

