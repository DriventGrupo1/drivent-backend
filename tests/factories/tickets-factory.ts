import { faker } from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(isRemote?: boolean, includesHotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.person.fullName(),
      price: faker.number.int({ min: 10, max: 300 }),
      isRemote: isRemote !== undefined ? isRemote : faker.datatype.boolean(),
      includesHotel: includesHotel !== undefined ? includesHotel : faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
