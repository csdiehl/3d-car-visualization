import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import relativeLinks from "astro-relative-links"

// https://astro.build/config
export default defineConfig({
  integrations: [react(), relativeLinks()],
  /*
    NOTE: Add "election-visualization-library" within the vite.optimizeDeps.exclude array below
    when you want to link a local copy of the viz lib during development
  */
  vite: {
    optimizeDeps: {
      exclude: [],
    },
    build: {
      assetsInlineLimit: 10000,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
  },
})
