// import {
//   RefreshTokenPayload,
//   refreshTokenSignOptions,
//   signToken,
//   verifyToken,
// } from "../utils/jwt";
import jwt from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeType.js";
import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verificationCode.model.js";
import { oneYearFromNow } from "../utils/date.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT } from "../constants/http.js";

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
  // create verificatoin code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerificaton,
    expiresAt: oneYearFromNow(),
  });
  // send verificaton email

  // create sesson
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent || "unknown",
  });
  // sign jwt
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    { audience: ["user"], expiresIn: "30d" }
  );

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_SECRET,
    { audience: ["user"], expiresIn: "15m" }
  );
  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
