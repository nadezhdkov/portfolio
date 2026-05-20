import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Extension maps for common game media assets
const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// Custom Vite plugin to handle /imagens_game assets in both Dev and Prod Prod builds
const copyImagensGamePlugin = () => {
  return {
    name: 'copy-imagens-game',
    configureServer(server: any) {
      server.middlewares.use('/imagens_game', (req: any, res: any, next: any) => {
        // Strip query params (like cache busters)
        const cleanUrl = req.url.split('?')[0];
        const filePath = path.resolve(__dirname, 'imagens_game', cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
          fs.createReadStream(filePath).pipe(res);
          return;
        }
        next();
      });
    },
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'imagens_game');
      const destDir = path.resolve(__dirname, 'dist/imagens_game');
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcFile = path.join(srcDir, file);
          const destFile = path.join(destDir, file);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      }
    }
  };
};

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), copyImagensGamePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
