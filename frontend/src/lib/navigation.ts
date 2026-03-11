import type { NavigateFunction } from "react-router-dom";

export let navigate: NavigateFunction = (() => {}) as NavigateFunction;

export const setNavigate = (fn: NavigateFunction) => {
  navigate = fn;
};
