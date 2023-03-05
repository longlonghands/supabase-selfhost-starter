const fs = require('fs')

if (process.argv.length < 3) {
  return
}
const name = process.argv[2]
const filename = `${Date.now()}_${name}.ts`
fs.writeFile(
  filename,
  `
/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
}

// you can define down operation as false to disable it
// like this: export const down = false

export async function down(pgm: MigrationBuilder): Promise<void> {
}

`,
  (err) => {
    // throws an error, you could also catch it here
    if (err) throw err

    // success case, the file was saved
    console.log(`the file '${filename}' has been created in current directory. please move it to proper place`)
  }
)
