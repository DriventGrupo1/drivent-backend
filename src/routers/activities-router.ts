import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { subscribeToActivity } from '@/controllers';
import { activitySchema } from '@/schemas/activities-schema';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken).post('/', validateBody(activitySchema), subscribeToActivity);

export { activitiesRouter };
