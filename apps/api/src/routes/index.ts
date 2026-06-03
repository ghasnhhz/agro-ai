import { Router } from 'express';

export const apiRouter = Router();

// Feature routers are mounted here as milestones land:
//   /auth (M1), /regions + /crops + /profitability (M2),
//   /disease (M3), /listings + /uploads (M4).
apiRouter.get('/ping', (_req, res) => {
  res.json({ pong: true });
});
