import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './app/index.tsx'
    }
  },
  output: {
    sourceMap: {
      js: 'source-map'
    }
  },
  server: {
    proxy: {
      "/backend": {
        target: "http://localhost:6789",
        changeOrigin: true,
        pathRewrite: {
          "^/backend": "",
        },
      }
    }
  }
});
