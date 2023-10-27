import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { authenticationService, SignInParams, AuthGitOrGoogle } from '@/services';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  const result = await authenticationService.signIn({ email, password });

  return res.status(httpStatus.OK).send(result);
}

export async function singInGoogle(req: Request, res: Response) {
  const { code } = req.body as AuthGitOrGoogle;
  const result = await authenticationService.signInGoogle(code);
  return res.status(httpStatus.OK).send(result);
}

export async function singInGit(req: Request, res: Response) {
  const { code } = req.body as AuthGitOrGoogle;
  const result = await authenticationService.signInGit(code);
  return res.status(httpStatus.OK).send(result);
}
