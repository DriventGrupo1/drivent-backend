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

export const activitiesEnrollmentRepository = {
  createActivityEnrollment,
  findActivityEnrollment,
};
