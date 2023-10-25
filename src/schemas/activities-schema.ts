import Joi from 'joi';
import { InputActivityBody } from '@/protocols';

export const activitySchema = Joi.object<InputActivityBody>({
  activityId: Joi.number().integer().min(1).required(),
});
