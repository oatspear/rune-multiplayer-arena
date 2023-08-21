import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import rune from "vite-plugin-rune"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  plugins: [vue(), rune({ logicPath: "./src/logic.ts" })],
})
