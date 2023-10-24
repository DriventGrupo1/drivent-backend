import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel
    .findFirst({
      where: {
        id: hotelId,
      },
      include: {
        Rooms: {
          include: {
            Booking: true,
          },
        },
      },
    })
    .then((hotel) => {
      let countBooked = 0;
      let capacity = 0;

      hotel.Rooms.forEach((room) => {
        countBooked += room.Booking.length;
        capacity += room.capacity;
      });

      return {
        ...hotel,
        available: capacity - countBooked,
      };
    });
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};
