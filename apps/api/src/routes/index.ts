import { Router } from 'express';
import { authRouter } from './auth.js';
import { profitabilityRouter, referenceRouter } from './profitability.js';

export const apiRouter = Router();

apiRouter.get('/ping', (_req, res) => {
  res.json({ pong: true });
});

// Feature routers (more land as milestones progress):
//   /disease (M3), /listings + /uploads (M4).
apiRouter.use('/auth', authRouter);
apiRouter.use('/', referenceRouter); // /regions, /crops
apiRouter.use('/profitability', profitabilityRouter);
