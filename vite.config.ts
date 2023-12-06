import {crx, ManifestV3Export} from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import manifest from "./src/manifest.config";
import devManifest from "./src/manifest.dev.config";

// @ts-ignore
console.log('Running a ',process.env.NODE_ENV, ' build...')
// @ts-ignore
const isDev = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), crx({ manifest: isDev ? devManifest : manifest })],
    // HACK: https://github.com/crxjs/chrome-extension-tools/issues/696
    // https://github.com/crxjs/chrome-extension-tools/issues/746
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            clientPort: 5173,
        },
    },
});
