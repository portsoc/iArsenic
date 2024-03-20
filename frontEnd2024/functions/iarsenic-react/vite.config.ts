import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'http://127.0.0.1:5001/iarsenic-staging/us-central1/app',
})
