import { prisma } from '@/config';

async function findActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: { id: activityId },
    include: { ActivityEnrollment: true },
  });
}

export const activitiesRepository = {
  findActivityById,
};
