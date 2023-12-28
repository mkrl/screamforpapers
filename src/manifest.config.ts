import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from '../package.json'

const { version, name, description } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

const iconDevPrefix = process.env.NODE_ENV === 'development' ? 'dev/' : ''

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: name,
  description: description,
  version: `${major}.${minor}.${patch}`,
  version_name: version,
  icons: {
    '16': `src/assets/icons/${iconDevPrefix}icon-16.png`,
    '32': `src/assets/icons/${iconDevPrefix}icon-32.png`,
    '48': `src/assets/icons/${iconDevPrefix}icon-48.png`,
    '128': `src/assets/icons/${iconDevPrefix}icon-128.png`,
  },
  background: {
    service_worker: 'src/background/index.ts',
  },
  options_ui: {
    page: 'src/dashboard/dashboard.html',
    // Include a flag to open options right away from dashboard, at production build is replaced to:
    // page: "src/dashboard/dashboard.html?options",
    open_in_tab: true,
  },
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '16': `src/assets/icons/${iconDevPrefix}icon-16.png`,
      '32': `src/assets/icons/${iconDevPrefix}icon-32.png`,
      '48': `src/assets/icons/${iconDevPrefix}icon-48.png`,
      '128': `src/assets/icons/${iconDevPrefix}icon-128.png`,
    },
  },
  permissions: [
    'storage',
    'activeTab',
    'scripting',
  ] as chrome.runtime.ManifestPermissions[],
}))
