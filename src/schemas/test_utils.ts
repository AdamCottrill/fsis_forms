export const pluck_first_issue = (schema, data) => {
  try {
    schema.parse(data);
  } catch (err) {
    return err.issues[0] || err[0];
  }
};

export const dateToString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
