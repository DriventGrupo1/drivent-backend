import { prisma } from '@/config';

async function createActivityEnrollment(activityId: number, enrollmentId: number) {
  return prisma.activityEnrollment.create({
    data: { activityId, enrollmentId },
  });
}

export const activitiesEnrollmentRepository = {
  createActivityEnrollment,
};
