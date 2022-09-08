import { defineConfig } from 'vite'
import path from 'path' 
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, 'lib/index.js'),
  //     name: 'CommandResolve',
  //     fileName: (format) => `command.resolve.${format}.js`
  //   }
  // }
})
