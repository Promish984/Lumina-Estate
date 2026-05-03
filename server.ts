import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import mongoose from 'mongoose';
import { apiRouter } from './server/api.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Error handler for express.json()
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next(err);
  });

  // Attempt DB Connection
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'))) {
    mongoose.connect(mongoUri)
      .then(() => console.log('MongoDB connected successfully'))
      .catch(err => console.error('MongoDB connection failed:', err.message));
  } else {
    console.warn('WARNING: Valid MONGODB_URI not found. Please set a valid MongoDB URI starting with mongodb:// or mongodb+srv:// to use the database API.');
  }

  // API routes
  app.use('/api', apiRouter);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
