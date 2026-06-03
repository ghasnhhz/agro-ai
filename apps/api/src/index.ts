import express from 'express';
import cors from 'cors';
import { config, DEV_AUTH, AI_ENABLED } from './config.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl (no origin) and configured web origins.
      if (!origin || config.webOrigin.includes(origin)) return cb(null, true);
      return cb(null, true); // permissive for hackathon/demo; tighten in prod
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve locally stored uploads (listing & scan images) when no cloud storage.
app.use('/uploads', express.static(new URL('../uploads', import.meta.url).pathname));

app.get('/health', (_req, res) => {
  res.json({ ok: true, devAuth: DEV_AUTH, aiEnabled: AI_ENABLED });
});

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[api] YerLab API listening on http://localhost:${config.port}`);
  console.log(`[api] devAuth=${DEV_AUTH} aiEnabled=${AI_ENABLED}`);
});
