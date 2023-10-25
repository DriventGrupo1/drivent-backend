import { notFoundError } from '@/errors';
import { cannotSubscribeToActivityError } from '@/errors/cannot-subscribe-to-activity-error';
import {
  activitiesEnrollmentRepository,
  activitiesRepository,
  enrollmentRepository,
  ticketsRepository,
} from '@/repositories';

async function subscribeToActivity(userId: number, activityId: number) {
  await checkActivity(activityId);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  return activitiesEnrollmentRepository.createActivityEnrollment(activityId, enrollment.id);
}

async function checkActivity(activityId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity <= activity.ActivityEnrollment.length) throw cannotSubscribeToActivityError();
}

async function getActivitiesByEventId(eventId: number){
  const activities = await activitiesRepository.getActivitiesByEventId(eventId)
  return activities
}

export const activitiesService = {
  subscribeToActivity,
  getActivitiesByEventId
};
