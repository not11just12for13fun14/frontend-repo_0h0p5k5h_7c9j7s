import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // listen on all interfaces so the preview URL can reach it
    port: 3000,
    strictPort: true
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        store: 'store.html',
        contact: 'contact.html',
        invoice: 'invoice.html'
      }
    }
  }
})
