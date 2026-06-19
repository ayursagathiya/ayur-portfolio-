import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'project-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/voltify') {
            req.url = '/voltify/';
          } else if (req.url === '/lounge') {
            req.url = '/lounge/';
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
        lounge: resolve(__dirname, 'lounge/index.html'),
      },
    },
  },
});
