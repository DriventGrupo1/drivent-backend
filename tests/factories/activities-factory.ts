import { faker } from '@faker-js/faker';
import { Auditorium, Event } from '@prisma/client';
import { prisma } from '@/config';

export function createActivity(event: Event) {
  return prisma.activity.create({
    data: {
      name: faker.company.buzzPhrase(),
      capacity: 1,
      date: event.startsAt,
      startTime: 900,
      endTime: 1200,
      auditorium: Auditorium.PRINCIPAL,
      eventId: event.id,
    },
  });
}
