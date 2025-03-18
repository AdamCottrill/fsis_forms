import React from "react";

export const LotTable = ({ lots }) => {
  const render_rows = (rows) => {
    return rows.map((row) => (
      <tr key={row.id}>
        <td>{row.slug}</td>
        <td>{row.lot_num}</td>
        <td>{row.spawn_year}</td>
        <td>
          {row.species_name} ({row.species_code})
        </td>
        <td>
          {row.strain_name} [{row.strain_code}]
        </td>

        <td>
          {row.proponent_name} ({row.proponent_abbrev})
        </td>

        <td>
          {row.rearing_location_name} ({row.rearing_location_abbrev})
        </td>
        <td>{row.funding_type}</td>
        <td>{row.is_active}</td>
      </tr>
    ));
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Lot Label</th>
          <th scope="col">Lot Num</th>
          <th scope="col">Spawn Year</th>
          <th scope="col">Species</th>
          <th scope="col">Strain Name</th>
          <th scope="col">Proponent</th>
          <th scope="col">Rearing Location</th>
          <th scope="col">Funding Type</th>
          <th scope="col">Is Active</th>
        </tr>
      </thead>
      <tbody>{lots && render_rows(lots)}</tbody>
    </table>
  );
};
