import {
  type RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
  // verifyToken,
} from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeType.js";
import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verificationCode.model.js";
import {
  ONE_DAY_MS,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/date.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT, UNAUTHORIZED } from "../constants/http.js";
import { sign } from "node:crypto";
import { now } from "mongoose";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verify existing user doesn't exist
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const userId = user._id;

  // create verificatoin code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerificaton,
    expiresAt: oneYearFromNow(),
  });
  // send verificaton email

  // create sesson
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent || "unknown",
  });
  // sign jwt
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({ userId, sessionId: session._id });
  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email });
  // verify they exist
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  // validate the password
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;
  // create the session
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  // sign accessa nd refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({ ...sessionInfo, userId: user._id });
  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // refresh session if it expires in the next 24 hrs
  const sessionNeedsRefresh = session.expiresAt.getTime() - now < ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
