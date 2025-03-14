export const extractYearFromTitle = (title) => {
  const match = title.match(/\((\d{4})\)/);
  return match ? parseInt(match[1], 10) : null;
};
