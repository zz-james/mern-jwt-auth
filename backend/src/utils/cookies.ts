import type { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.js";

const secure = process.env.NODE_ENV !== "development" ? true : false;

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessTokenCookieOptons = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh",
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptons())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};
