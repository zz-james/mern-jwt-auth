export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const oneYearFromNow = () => {
  return new Date(Date.now() + 365 * ONE_DAY_MS);
};

export const thirtyDaysFromNow = () => {
  return new Date(Date.now() + 30 * ONE_DAY_MS);
};

export const fifteenMinutesFromNow = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};
