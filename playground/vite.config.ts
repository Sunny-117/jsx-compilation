import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { jsxCompilationRs } from '../vite-plugin-jsx-compilation-rs.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Temporarily disabled until WASM integration is complete
    // jsxCompilationRs({
    //   rustProjectPath: '../jsx-compilation-rs',
    //   buildOnStart: true,
    //   useWasm: true, // Set to true to use WASM instead of native binary
    // })
  ],
})
