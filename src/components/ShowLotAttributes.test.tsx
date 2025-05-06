import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";

import { ShowLotAttributes } from "./ShowLotAttributes";

describe("ShowLotAttributes Component", () => {
  const lots = [
    {
      id: 12,
      lot_num: "240",
      spawn_year: 2024,
      species_name: "Walleye",
      species_code: "334",
      strain_name: "Lake Manitou (Wild)",
      strain_code: "LM",
      rearing_location_name: "BLUE JAY CREEK",
      rearing_location_abbrev: "BJFSC",
      is_active: true,
      slug: "240-2024-334-lm-bjfsc",
    },
    {
      id: 10,
      lot_num: "241",
      spawn_year: 2024,
      species_name: "Lake Trout",
      species_code: "081",
      strain_name: "Lake Manitou (Wild)",
      strain_code: "LM",
      rearing_location_name: "BLUE JAY CREEK",
      rearing_location_abbrev: "BJFSC",
      is_active: true,
      slug: "241-2024-081-lm-bjfsc",
    },
    {
      id: 3,
      lot_num: "332",
      spawn_year: 2024,
      species_name: "Rainbow Trout",
      species_code: "076",
      strain_name: "Ganaraska River (Wild)",
      strain_code: "GN",
      rearing_location_name: "NORMANDALE",
      rearing_location_abbrev: "NMFCS",
      is_active: true,
      slug: "332-2024-076-gn-nmfcs",
    },
  ];

  it("renders correct html if a selected lot is provided", () => {
    render(<ShowLotAttributes lots={lots} selectedLot={lots[0].slug} />);

    const myShowLotAttributes = screen.getByTestId("selected-lot-attributes");
    expect(myShowLotAttributes).toBeInTheDocument();

    // make sure we see the species
    const species = within(myShowLotAttributes).getByTestId("selected-species");
    expect(species).toHaveTextContent("Species: Walleye (334)");
    //
    // make sure we see the strain too
    const strain = within(myShowLotAttributes).getByTestId("selected-strain");
    expect(strain).toHaveTextContent("Strain:Lake Manitou (Wild) (LM)");
  });

  it("renders nothing if a selected lot is not provided.", () => {
    render(<ShowLotAttributes lots={lots} />);
    const myShowLotAttributes = screen.queryByTestId("selected-lot-attributes");
    expect(myShowLotAttributes).toBeNull();
  });

  it("renders nothing if a the lots array does not exist.", () => {
    render(<ShowLotAttributes lots={[]} selectedLot="foobar" />);
    const myShowLotAttributes = screen.queryByTestId("selected-lot-attributes");
    expect(myShowLotAttributes).toBeNull();
  });
});
