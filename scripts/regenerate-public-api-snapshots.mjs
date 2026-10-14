import {
  PUBLIC_API_PACKAGES,
  collectPackageExportNames,
  writeSnapshot,
} from './public-api-snapshot.mjs'

for (const packageDir of PUBLIC_API_PACKAGES) {
  const names = await collectPackageExportNames(packageDir)
  writeSnapshot(packageDir, names)
  console.log(`Wrote ${packageDir} (${names.length} exports)`)
}
