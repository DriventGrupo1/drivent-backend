import { prisma } from '@/config';

async function findActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: { id: activityId },
    include: { ActivityEnrollment: true },
  });
}

async function getActivitiesByEventId(eventId: number) {
  return prisma.activity.findMany({
    where: {eventId},
    orderBy: {
      date: 'asc'
    },
    select: {
      id: true,
      name: true,
      capacity: true,
      date: true,
      startTime: true,
      endTime: true,
      auditorium: true,
      _count:{
        select:{
          ActivityEnrollment: true
        }
      }
    }
  });
}

export const activitiesRepository = {
  findActivityById,
  getActivitiesByEventId
};
