export const pagination = (page, list) => {
  const start = (page - 1) * list;
  const end = list;

  return [start, end];
};
