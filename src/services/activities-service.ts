import { invalidDataError, notFoundError, requestError } from '@/errors';
import {
  activitiesEnrollmentRepository,
  activitiesRepository,
  enrollmentRepository,
  eventRepository,
  ticketsRepository,
} from '@/repositories';
import e from 'cors';
import dayjs from 'dayjs';

async function subscribeToActivity(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  
  await checkActivity(activityId, enrollment.id);
  
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const userActivityEnrollment = await activitiesEnrollmentRepository.findActivityEnrollment(activityId, enrollment.id);
  if (userActivityEnrollment) throw requestError(403, 'Forbidden');

  return activitiesEnrollmentRepository.createActivityEnrollment(activityId, enrollment.id);
}

async function checkActivity(activityId: number, enrollmentId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity <= activity.ActivityEnrollment.length) throw requestError(403, 'Forbidden');

  const conflictingActivity = await activitiesEnrollmentRepository.findActivityEnrollmentByTime(enrollmentId, activity.endTime, activity.startTime)
  const filteredConflictingActivity = conflictingActivity.filter(
    (activityEnrollment)=> dayjs(activityEnrollment.Activity.date).format('YYYY-MM-DD') === dayjs(activity.date).format('YYYY-MM-DD')
  )
  if(filteredConflictingActivity.length > 0) throw requestError(409, 'Conflict')
}

async function getActivitiesByEventId(eventId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  if (!eventId || isNaN(eventId)) throw invalidDataError('eventId');
  const event = await eventRepository.findById(eventId);

  if (!event) throw notFoundError();

  const activities = await activitiesRepository.getActivitiesByEventId(eventId, enrollment.id);
  return activities;
}

export const activitiesService = {
  subscribeToActivity,
  getActivitiesByEventId,
};
