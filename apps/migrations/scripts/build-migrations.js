import dotenv from 'dotenv'
dotenv.config()

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src')

function getMigrationFiles(dir) {
  let files = []
  const items = fs.readdirSync(dir)
  for (const i in items) {
    const filePath = dir + '/' + items[i]
    if (fs.statSync(filePath).isDirectory()) {
      files = files.concat(getMigrationFiles(filePath))
    } else {
      const matcher = new RegExp(/^(\d+)_.+\.ts$/gm)
      const matches = matcher.exec(items[i])
      if (matches !== null && matches.length >= 2) {
        console.log(`found ${items[i]}`)
        files.push({
          timestamp: Number.parseInt(matches[1]),
          name: items[i],
          filePath: filePath,
        })
      }
    }
  }
  return files
}

const migrationFiles = getMigrationFiles(srcDir).sort((a, b) => a.timestamp - b.timestamp)
// const migrationsDir = path.join(__dirname, '..', 'migrations')

migrationFiles.forEach((m) => {
  const parsed = path.parse(m.filePath)

  execSync(
    `npx esbuild ${m.filePath} --platform=node --bundle --packages=external --outfile=../../out/apps/migrations/${parsed.name}.js`
  )
})
