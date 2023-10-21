import { TicketStatus } from '@prisma/client';
import { redis, DEFAULT_EXP } from '@/config';
import { invalidDataError, notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  await validateUserBooking(userId);
  const cacheKey = 'hotelsList';
  const cachedHotelsList = await redis.get(cacheKey);
  if (cachedHotelsList) {
    return JSON.parse(cachedHotelsList);
  } else {
    const hotels = await hotelRepository.findHotels();
    if (hotels.length === 0) throw notFoundError();
    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotels));
    return hotels;
  }
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await validateUserBooking(userId);

  if (!hotelId || isNaN(hotelId)) throw invalidDataError('hotelId');

  const cacheKey = `hotelId${hotelId}`;
  const cachedHotel = await redis.get(cacheKey);

  if (cachedHotel) {
    return JSON.parse(cachedHotel);
  } else {
    const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);
    if (!hotelWithRooms) throw notFoundError();
    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotelWithRooms));
    return hotelWithRooms;
  }
}

export const hotelsService = {
  getHotels,
  getHotelsWithRooms,
};
