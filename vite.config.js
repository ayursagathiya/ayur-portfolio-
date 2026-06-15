import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'voltify-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/voltify') {
            req.url = '/voltify/';
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        voltify: resolve(__dirname, 'voltify/index.html'),
      },
    },
  },
});
