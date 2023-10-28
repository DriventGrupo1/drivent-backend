import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';

async function findPaymentByTicketId(ticketId: number) {
  const result = await prisma.payment.findFirst({
    where: { ticketId },
  });
  return result;
}

async function processTicketAndCreatePayment(ticketId: number, params: PaymentParams) {
  const result = await prisma.$transaction(async (prisma) => {
    await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
      },
    });

    const createdPayment = await prisma.payment.create({
      data: {
        ticketId,
        ...params,
      },
    });

    return createdPayment;
  });

  return result;
}

export const paymentsRepository = {
  findPaymentByTicketId,
  processTicketAndCreatePayment,
};
