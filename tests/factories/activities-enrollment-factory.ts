import { prisma } from '@/config';

export function createActivityEnrollment(enrollmentId: number, activityId: number) {
  return prisma.activityEnrollment.create({
    data: {
      enrollmentId,
      activityId,
    },
  });
}
