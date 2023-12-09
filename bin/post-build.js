import fs from 'fs'

console.log('Post build...')

const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'))

console.log('Modifying manifest...')
manifest.options_ui.page = "src/dashboard/dashboard.html?options"

fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 2), 'utf8')

console.log('Done!')