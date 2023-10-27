import { Router } from 'express';
import { singInPost, singInGoogle, singInGit } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter
  .post('/sign-in', validateBody(signInSchema), singInPost)
  .post('/google', singInGoogle)
  .post('/git', singInGit);

export { authenticationRouter };
