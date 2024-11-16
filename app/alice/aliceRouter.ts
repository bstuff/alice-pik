import { Router } from 'express';

import {
  actionMiddleware,
  deviceListMiddleware,
  deviceStateMiddleware,
  pingMiddleware,
  userUnlinkMiddleware,
} from './middlewares';

export const aliceRouter = Router();

aliceRouter.head('/', pingMiddleware);
aliceRouter.post('/user/unlink', userUnlinkMiddleware);
aliceRouter.get('/user/devices', deviceListMiddleware);
aliceRouter.post('/user/devices/query', deviceStateMiddleware);
aliceRouter.post('/user/devices/action', actionMiddleware);
