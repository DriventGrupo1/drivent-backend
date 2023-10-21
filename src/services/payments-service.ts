import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { CardPaymentParams, PaymentParams } from '@/protocols';
import { enrollmentRepository, paymentsRepository, ticketsRepository } from '@/repositories';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function verifyTicketAndEnrollment(userId: number, ticketId: number) {
  if (!ticketId || isNaN(ticketId)) throw invalidDataError('ticketId');

  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  return { ticket, enrollment };
}

async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(userId, ticketId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);

  return payment;
}

async function paymentProcess(ticketId: number, userId: number, cardData: CardPaymentParams, userEmail: string) {
  const { ticket } = await verifyTicketAndEnrollment(userId, ticketId);
  ticket.TicketType.price;

  const paymentData: PaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentsRepository.createPayment(ticketId, paymentData);
  await ticketsRepository.ticketProcessPayment(ticketId);

  const email = {
    to: userEmail,
    from: 'drivent_api@outlook.com',
    subject: 'Drivent: Ticket Payment Confirmed',
    text: `
      The payment of your ticket has been confirmed. 
      Price: R$ ${ticket.TicketType.price}. 
      Card last digits: ${paymentData.cardLastDigits}. 
      Type of ticket: ${
        ticket.TicketType.isRemote
          ? 'Online.'
          : ticket.TicketType.includesHotel
          ? 'Presential with hotel.'
          : 'Presential without hotel.'
      }
    `,
  };

  sgMail
    .send(email)
    .then(() => {
      console.log('Message sent');
    })
    .catch((error) => {
      console.error(error);
    });

  return payment;
}

export const paymentsService = {
  getPaymentByTicketId,
  paymentProcess,
};
