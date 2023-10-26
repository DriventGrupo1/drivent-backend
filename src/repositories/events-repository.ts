import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}

async function findById(eventId: number) {
  return prisma.event.findUnique({
    where: {
      id: eventId
    }
  })
}

export const eventRepository = {
  findFirst,
  findById
};
