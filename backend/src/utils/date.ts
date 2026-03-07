const days = 24 * 60 * 60 * 1000;

export const oneYearFromNow = () => {
  return new Date(Date.now() + 365 * days);
};

export const thirtyDaysFromNow = () => {
  return new Date(Date.now() + 30 * days);
};

export const fifteenMinutesFromNow = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};
