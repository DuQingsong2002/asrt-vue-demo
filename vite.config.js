import { defineConfig } from 'vite'
import path from 'path' 
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: 'example/public',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/index.ts'),
      name: 'CommandResolve',
      fileName: (format) => `command.resolve.${format}.js`
    }
  }
})
