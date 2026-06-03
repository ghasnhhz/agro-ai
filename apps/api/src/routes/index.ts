import { Router } from 'express';
import { authRouter } from './auth.js';
import { profitabilityRouter, referenceRouter } from './profitability.js';
import { diseaseRouter } from './disease.js';
import { listingsRouter } from './listings.js';
import { uploadsRouter } from './uploads.js';

export const apiRouter = Router();

apiRouter.get('/ping', (_req, res) => {
  res.json({ pong: true });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/', referenceRouter); // /regions, /crops
apiRouter.use('/profitability', profitabilityRouter);
apiRouter.use('/disease', diseaseRouter);
apiRouter.use('/listings', listingsRouter);
apiRouter.use('/uploads', uploadsRouter);
