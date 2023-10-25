import { CreateBookingParams, UpdateBookingParams } from '@/protocols';
import { prisma } from '@/config';

async function create({ roomId, userId }: CreateBookingParams) {
  return prisma.booking.create({
    data: { roomId, userId },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
    include: { Room: true },
  });
}

async function findByUserId(userId: number) {
  const result = await prisma.booking.findFirst({
    where: { userId },
    include: { Room: { include: { Hotel: true } } },
  });
  if (result) {
    const bookings = await findByRoomId(result.roomId);
    return { ...result, bookings: bookings.length };
  }
  return result;
}

async function upsertBooking({ id, roomId, userId }: UpdateBookingParams) {
  return prisma.booking.upsert({
    where: { id },
    create: { roomId, userId },
    update: { roomId },
  });
}

export const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
};
