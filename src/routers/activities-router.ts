import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getActivitiesByEventId, subscribeToActivity } from '@/controllers';
import { activitySchema } from '@/schemas/activities-schema';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(activitySchema), subscribeToActivity)
  .get('/:eventId', getActivitiesByEventId);

export { activitiesRouter };
