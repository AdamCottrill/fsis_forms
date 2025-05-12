export const pluck_first_issue = (schema, data) => {
  try {
    schema.parse(data);
  } catch (err) {
    return err.issues[0] || err[0];
  }
};
