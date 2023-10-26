import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createPayment(ticketId: number, value: number) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer: faker.person.fullName(),
      cardLastDigits: faker.number.int({ min: 1000, max: 9999 }).toString(),
    },
  });
}

export function generateCreditCardData() {
  const futureDate = faker.date.future();

  return {
    issuer: faker.finance.creditCardIssuer(),
    number: faker.number.int({ min: 100000000000000, max: 999999999999999 }).toString(),
    name: faker.person.fullName(),
    expirationDate: `${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`,
    cvv: faker.number.int({ min: 100, max: 999 }).toString(),
  };
}
