import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services';

export async function subscribeToActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.body.activityId);

  const activity = await activitiesService.subscribeToActivity(userId, activityId);

  return res.status(httpStatus.OK).send({ activityEnrollmentId: activity.id });
}

export async function getActivitiesByEventId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const eventId = Number(req.params.eventId);

  const activities = await activitiesService.getActivitiesByEventId(eventId, userId);

  return res.status(httpStatus.OK).send(activities);
}
