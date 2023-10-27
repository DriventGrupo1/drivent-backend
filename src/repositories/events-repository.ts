import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}

async function findById(eventId: number) {
  return prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
}

export const eventRepository = {
  findFirst,
  findById,
};

// async function findFirst() {
//   return prisma.$transaction(async (prisma) => {
//     const event = await prisma.event.findFirst({});
//     const activities = await prisma.activity.groupBy({ by: ['date'], where: { date: {} }, orderBy: { date: 'asc' } });
//     return { ...event, activityDays: activities };
//   });
// }
