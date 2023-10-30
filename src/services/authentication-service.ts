import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import { OAuth2Client } from 'google-auth-library';
import qs from 'qs';
import { loadEnv } from '../config/envs';
import { userService } from '.';
import { authenticationRepository, userRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { request } from '@/utils/request';
import { invalidCredentialsError } from '@/errors';

loadEnv();

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;
  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id, email);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function signInGoogle(code: string) {
  const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

  const { tokens } = await oAuth2Client.getToken(code);
  const { sub, email } = jwt_decode(tokens.id_token) as GoogleTokenInfo;

  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });

  if (!user) {
    const user = await userService.createUser({ email, password: sub });
    const token = await createSession(user.id, email);

    return {
      user: exclude(user, 'password'),
      token,
    };
  }
  const token = await createSession(user.id, email);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function signInGit(code: string) {
  const GIT_AUTH_URL = 'https://github.com/login/oauth/access_token';
  const params: GitParams = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.GIT_REDIRECT_URL,
    client_id: process.env.GIT_CLIENT_ID,
    client_secret: process.env.GIT_CLIENT_SECRET,
  };

  const { data } = await request.post(GIT_AUTH_URL, params);
  const gitToken = qs.parse(data);

  const GIT_USERINFO_URL = 'https://api.github.com/user';
  const configs = { headers: { Authorization: 'Bearer ' + gitToken.access_token } };

  const userData = await request.get(GIT_USERINFO_URL, configs);
  const { id, email } = userData.data as GitUserInfo;

  console.log('console01: ', id, email);
  if (email !== null) {
    const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
    console.log('console01: ', email, user);

    const token = await createSession(user.id, email);
    if (!user) {
      const user = await userService.createUser({ email, password: id.toString() });
      const token = await createSession(user.id, email);
      return {
        user: exclude(user, 'password'),
        token,
      };
    }

    return {
      user: exclude(user, 'password'),
      token,
    };
  } else {
    const user = await userService.createUser({ email: `${id.toString()}@email.com`, password: id.toString() });
    const token = await createSession(user.id, email);
    return {
      user: exclude(user, 'password'),
      token,
    };
  }
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number, userEmail: string) {
  const token = jwt.sign({ userId, userEmail }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, 'email' | 'password'>;

export type AuthGitOrGoogle = {
  code: string;
};

type GoogleTokenInfo = {
  sub: string;
  email: string;
};

type GitUserInfo = {
  id: number;
  email: string;
};

type GitParams = {
  code: string;
  grant_type: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
};

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export const authenticationService = {
  signIn,
  signInGoogle,
  signInGit,
};
