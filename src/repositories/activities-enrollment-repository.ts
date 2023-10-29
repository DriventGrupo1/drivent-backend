import { prisma } from '@/config';

async function createActivityEnrollment(activityId: number, enrollmentId: number) {
  return prisma.activityEnrollment.create({
    data: { activityId, enrollmentId },
  });
}

async function findActivityEnrollment(activityId: number, enrollmentId: number) {
  return prisma.activityEnrollment.findFirst({
    where: { activityId, enrollmentId },
  });
}

async function findActivityEnrollmentByTime(enrollmentId: number, endTime: number, startTime: number){
  return prisma.activityEnrollment.findMany({
    include:{
      Activity: true
    },
    where: {
      enrollmentId,
      Activity: {
        OR: [
          {startTime: {
            gte: startTime,
            lte: endTime,
          }},
          {endTime: {
            gte: startTime,
            lte: endTime,
          }},
          {
            endTime:{
              lte: endTime,
            },
            startTime:{
              gte:startTime
            }
          }
        ],
      }
    }
  })
}

export const activitiesEnrollmentRepository = {
  createActivityEnrollment,
  findActivityEnrollment,
  findActivityEnrollmentByTime
};
