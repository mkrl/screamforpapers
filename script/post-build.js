console.log('Removing side_panel from manifest, be ready...')

import manifest from '../dist/manifest.json' assert { type: "json" };
import fs from 'fs/promises'

const newManifest = {...manifest}
delete newManifest.side_panel

fs.writeFile('./dist/manifest.json', JSON.stringify(newManifest, null, 2))

console.log('side_panel eliminated')
