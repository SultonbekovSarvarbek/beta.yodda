import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],

          // Router and query
          'tanstack-vendor': [
            '@tanstack/react-router',
            '@tanstack/react-query',
          ],

          // UI components
          'radix-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-aspect-ratio',
          ],

          // Icons
          'lucide-vendor': ['lucide-react'],

          // Forms and validation
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],

          // i18n
          'i18n-vendor': ['i18next', 'react-i18next'],

          // Utilities
          'utils-vendor': [
            'axios',
            'zustand',
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
          ],
        },
      },
    },
  },
})

