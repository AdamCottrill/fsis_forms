// create an key-value array of objects for drop-down lists in fsis-infinity forms
export const get_code_labels = (data, code, label, descending = false) => {
  const sort_order = descending === false ? 1 : -1;
  const tmp = new Map(
    data.map((x) => [
      x[code],
      {
        code: x[code],
        label: label == code ? x[code] : `${x[label]} (${x[code]})`,
      },
    ]),
  );
  const code_labels = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 * sort_order : -1 * sort_order,
  );
  return code_labels;
};
