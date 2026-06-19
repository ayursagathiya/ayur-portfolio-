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
          } else if (req.url === '/projects') {
            req.url = '/projects/';
          } else if (req.url === '/projects/voltify') {
            req.url = '/projects/voltify/';
          } else if (req.url === '/projects/lounge') {
            req.url = '/projects/lounge/';
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
        projects: resolve(__dirname, 'projects/index.html'),
        projects_voltify: resolve(__dirname, 'projects/voltify/index.html'),
        projects_lounge: resolve(__dirname, 'projects/lounge/index.html'),
      },
    },
  },
});
