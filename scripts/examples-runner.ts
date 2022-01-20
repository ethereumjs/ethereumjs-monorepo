import {extname, join} from "path";
import {readdir} from "fs";

const pkg = process.argv[3]
if (!pkg) {
  throw new Error("Package argument must be passed")
}

const examplesPath = `../packages/${pkg}/examples/`
const path = join(__dirname, examplesPath)

readdir(path, async (err, files) => {
  if (err) {
    return console.log("Error loading examples directory: ", err)
  }
  const importedFiles = files.map(fileName => {
    if (extname(fileName) === ".ts") {
      return import(examplesPath + fileName);
    }
  }).filter(file => file)

  await Promise.all(importedFiles)
})