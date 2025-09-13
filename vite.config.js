import { defineConfig } from 'vite';

export default defineConfig({
  // base: process.env.NODE_ENV === 'production' ? '/IKS-Project/' : '',
  base: "/IKS-Project",
  assetsInclude: ['**/*.glb'],
});