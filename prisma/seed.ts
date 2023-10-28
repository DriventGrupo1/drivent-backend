import { Event, Activity, Auditorium, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function sample<Type>(array: Type[]): Type {
  return array[Math.floor(Math.random() * array.length)];
}

function createActivities(event: Event) {
  type ActivitiesCreateInput = Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>;
  const data: ActivitiesCreateInput[] = [];
  const auditoriumType: Auditorium[] = ['LATERAL', 'PRINCIPAL', 'WORKSHOP'];

  let startDate = event.startsAt;
  while (startDate <= event.endsAt) {
    for (let i = 0; i < auditoriumType.length; i++) {
      const activitiesNumber = faker.number.int({ min: 2, max: 4 });
      let startTime = 900;
      for (let j = 0; j < activitiesNumber; j++) {
        let endTime = startTime + sample([100, 200]);
        data.push({
          name: faker.company.buzzPhrase(),
          eventId: event.id,
          capacity: 30,
          date: startDate,
          startTime,
          endTime,
          auditorium: auditoriumType[i],
        });
        startTime = endTime;
      }
    }
    startDate = dayjs(startDate).add(1, 'days').toDate();
  }
  return data;
}

async function main() {
  const event = await prisma.event.findFirst();

  if (!event) {
    const newEvent = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driven.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
    const activitiesData = createActivities(newEvent);
    await prisma.activity.createMany({ data: activitiesData });
    console.log(activitiesData);
  } else {
    const activities = await prisma.activity.findMany({});
    if (!activities) {
      const activitiesData = createActivities(event);
      await prisma.activity.createMany({ data: activitiesData });
      console.log(activitiesData);
    } else {
      console.log(activities);
    }
  }
  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
