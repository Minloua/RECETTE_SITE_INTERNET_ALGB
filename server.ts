import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiApp } from './server/apiApp.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createApiApp();
  const port = Number(process.env.PORT) || 3000;

  app.use(
    '/deliverables_video',
    express.static(path.resolve(__dirname, 'deliverables_video'), {
      acceptRanges: true,
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.zip')) {
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${path.basename(filePath)}"`
          );
        }
      },
    })
  );

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur ALGB sécurisé prêt sur http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Échec du démarrage du serveur:', err);
  process.exit(1);
});
