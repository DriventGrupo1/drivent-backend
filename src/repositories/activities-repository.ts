import { prisma } from '@/config';

async function findActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: { id: activityId },
    include: { ActivityEnrollment: true },
  });
}

async function getActivitiesByEventId(eventId: number, enrollmentId: number) {
  return prisma.activity.findMany({
    where: { eventId },
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
      ActivityEnrollment: {
        where: {
          enrollmentId,
        }
      },
      _count:{
        select:{
          ActivityEnrollment: true
        }
      }
    }
  })
  .then((activities)=>{
    const newActivities = activities.map((activity)=>{
      if(activity.ActivityEnrollment.length > 0){
        delete activity.ActivityEnrollment
        return {
          ...activity,
          subscribed: true,
        }
      }
      delete activity.ActivityEnrollment
      return {
        ...activity,
        subscribed: false,
      }
    })
    return newActivities
  });
}

export const activitiesRepository = {
  findActivityById,
  getActivitiesByEventId,
};
