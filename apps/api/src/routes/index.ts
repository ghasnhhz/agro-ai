import { Router } from 'express';
import { authRouter } from './auth.js';
import { profitabilityRouter, referenceRouter } from './profitability.js';
import { diseaseRouter } from './disease.js';

export const apiRouter = Router();

apiRouter.get('/ping', (_req, res) => {
  res.json({ pong: true });
});

// Feature routers (more land as milestones progress):
//   /listings + /uploads (M4).
apiRouter.use('/auth', authRouter);
apiRouter.use('/', referenceRouter); // /regions, /crops
apiRouter.use('/profitability', profitabilityRouter);
apiRouter.use('/disease', diseaseRouter);
