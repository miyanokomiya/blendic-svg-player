import path from 'path'
import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  build: {
    lib:
      process.env.LIB === '1'
        ? {
            entry: path.resolve(__dirname, 'src/Player.svelte'),
            name: 'blendic-svg-player',
          }
        : undefined,
  },
})
