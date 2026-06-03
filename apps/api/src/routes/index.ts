import { Router } from 'express';
import { authRouter } from './auth.js';

export const apiRouter = Router();

apiRouter.get('/ping', (_req, res) => {
  res.json({ pong: true });
});

// Feature routers (more land as milestones progress):
//   /regions + /crops + /profitability (M2), /disease (M3), /listings + /uploads (M4).
apiRouter.use('/auth', authRouter);
