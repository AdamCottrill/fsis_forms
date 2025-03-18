// create an key-value array of objects for drop-down lists in fsis-infinity forms
export const get_value_labels = (data, value:string, label:string, descending:boolean = false, null_string?:string) => {
  const sort_order = descending === false ? 1 : -1;
  const tmp = new Map(
    data.map((x) => [
      x[value],
      {
        value: x[value],
        label: label == value ? x[value] : `${x[label]} (${x[value]})`,
      },
    ]),
  );
  const value_labels = [...tmp.values()].sort((a, b) =>
    a.label > b.label ? 1 * sort_order : -1 * sort_order,
  );


  if (null_string){
    value_labels.splice(0,0, {value:"", label:null_string})
  }

  return value_labels;
};
