import { invalidDataError, notFoundError, requestError } from '@/errors';
import {
  activitiesEnrollmentRepository,
  activitiesRepository,
  enrollmentRepository,
  eventRepository,
  ticketsRepository,
} from '@/repositories';

async function subscribeToActivity(userId: number, activityId: number) {
  await checkActivity(activityId);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const userActivityEnrollment = await activitiesEnrollmentRepository.findActivityEnrollment(activityId, enrollment.id);
  if (userActivityEnrollment) throw requestError(403, 'Forbidden');

  return activitiesEnrollmentRepository.createActivityEnrollment(activityId, enrollment.id);
}

async function checkActivity(activityId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity <= activity.ActivityEnrollment.length) throw requestError(403, 'Forbidden');
}

async function getActivitiesByEventId(eventId: number) {
  if (!eventId || isNaN(eventId)) throw invalidDataError('eventId');
  const event = await eventRepository.findById(eventId);
  if (!event) throw notFoundError();

  const activities = await activitiesRepository.getActivitiesByEventId(eventId);
  return activities;
}

export const activitiesService = {
  subscribeToActivity,
  getActivitiesByEventId,
};
