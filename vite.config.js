import { build, defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/IKS-Project/' : '',
  // base: "/IKS-Project",
  assetsInclude: ['**/*.glb'],
  vite:{
    build:{
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      }
    }
  }
});