import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { redis, DEFAULT_EXP } from '@/config';
import { notFoundError } from '@/errors';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = 'event';

  const cachedEvent = await redis.get(cacheKey);
  if (cachedEvent) {
    return JSON.parse(cachedEvent);
  } else {
    const event = await eventRepository.findFirst();
    if (!event) throw notFoundError();
    const data = exclude(event, 'createdAt', 'updatedAt');
    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(data));
    return data;
  }
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function isCurrentEventActive(): Promise<boolean> {
  const cacheKey = 'event';
  const cachedEvent = await redis.get(cacheKey);

  if (cachedEvent) {
    const event = JSON.parse(cachedEvent);
    return checkDates(event);
  } else {
    const event = await eventRepository.findFirst();
    if (!event) return false;

    const data = exclude(event, 'createdAt', 'updatedAt');
    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(data));
    return checkDates(event);
  }
}

function checkDates(event: Event): boolean {
  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);
  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

export const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};
