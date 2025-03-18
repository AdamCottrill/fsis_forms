import React from "react";

export const LotTable = ({ lots }) => {
  const render_rows = (rows) => {
    return rows.map((row) => (
      <tr key={row.id}>
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
          <th scope="col">lot_num</th>
          <th scope="col">spawn_year</th>
          <th scope="col">species</th>
          <th scope="col">strain_name</th>
          <th scope="col">Proponent</th>
          <th scope="col">Rearing Location</th>
          <th scope="col">funding_type</th>
          <th scope="col">is_active</th>
        </tr>
      </thead>
      <tbody>{lots && render_rows(lots)}</tbody>
    </table>
  );
};
