import { faker } from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  createHotel,
  createRoomWithHotelId,
  createBooking,
  createEvent,
  createActivity,
  createActivityEnrollment,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /activities', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/activities').send({ activityId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ activityId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ activityId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 if body is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if activity id is not valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ activityId: 0 });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if activity id does no exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({ activityId: 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if activity capacity is full', async () => {
      const event = await createEvent();

      const fakeuser = await createUser();
      await generateValidToken(fakeuser);
      const fakeenrollment = await createEnrollmentWithAddress(fakeuser);
      const faketicketType = await createTicketType(false, true);
      const faketicket = await createTicket(fakeenrollment.id, faketicketType.id, TicketStatus.PAID);
      await createPayment(faketicket.id, faketicketType.price);

      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activity = await createActivity(event);
      await createActivityEnrollment(fakeenrollment.id, activity.id);

      const response = await server
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({ activityId: activity.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 if all is good', async () => {
      const event = await createEvent();

      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const activity = await createActivity(event);

      const response = await server
        .post('/activities')
        .set('Authorization', `Bearer ${token}`)
        .send({ activityId: activity.id });

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});