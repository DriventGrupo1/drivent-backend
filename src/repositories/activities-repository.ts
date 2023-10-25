import { prisma } from '@/config';

async function findActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: { id: activityId },
    include: { ActivityEnrollment: true },
  });
}

async function getActivitiesByEventId(eventId: number) {
  return prisma.activity.findMany({
    where: { eventId },
  });
}

export const activitiesRepository = {
  findActivityById,
  getActivitiesByEventId,
};
