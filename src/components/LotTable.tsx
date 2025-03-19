import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const LotTable = ({ lots, selectedLot, rowClicked }) => {
  const render_rows = (rows) => {
    return rows.map((row) => (
      <tr key={row.id}>
        <td>
          <label htmlFor={row.slug} className="visuallyhidden">
            Select Lot {row.slug}{" "}
          </label>
          <Form.Check // prettier-ignore
            className="mt-2"
            type="radio"
            id={row.slug}
            onChange={rowClicked}
            name="lot-options"
            checked={row.slug == selectedLot}
          />
        </td>
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

  if (lots.length === 0) {
    return (
      <div className="alert alert-warning" role="alert">
        <p>Oops! No Lots match those criteria.</p>
      </div>
    );
  }

  return (
    <table className="table table-sm table-hover">
      <thead>
        <tr>
          <th scope="col">Select</th>
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
