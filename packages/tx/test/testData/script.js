import fs from 'fs'
import path from 'path'

const inputDir = '.' // Directory containing JSON files
const outputDir = './' // Directory to save TypeScript files

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// Function to convert JSON file to TypeScript file
function convertJsonToTs(fileName) {
  const filePath = path.join(inputDir, fileName)
  const outputFilePath = path.join(outputDir, fileName.replace('.json', '.ts'))

  // Read the JSON file
  const jsonData = fs.readFileSync(filePath, 'utf8')

  // Parse the JSON content
  const jsonObject = JSON.parse(jsonData)

  // Create the TypeScript content
  const tsContent = `export const ${fileName.slice(0, -5)}Data = ${JSON.stringify(jsonObject, null, 2)};\n`

  // Write the TypeScript file
  fs.writeFileSync(outputFilePath, tsContent, 'utf8')
  console.log(`Converted ${fileName} to ${outputFilePath}`)
}

// Read all JSON files in the input directory
fs.readdirSync(inputDir).forEach((file) => {
  if (path.extname(file) === '.json') {
    convertJsonToTs(file)
  }
})
