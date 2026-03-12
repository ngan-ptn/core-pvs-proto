import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/types/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['better-sqlite3'],
  outDir: 'dist',
})
