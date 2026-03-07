import assert from "node:assert";
import AppError from "./AppError.js";
import type { HttpStatusCode } from "../constants/http.js";
import type AppErrorCode from "../constants/appErrorCode.js";

/**
 * asserts a condition and throws an app error if confition is falsey
 */
type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  AppErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  AppErrorCode
) => assert(condition, new AppError(httpStatusCode, message, AppErrorCode));

export default appAssert;
