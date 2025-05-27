import { parseLotSlug, get_value_labels } from "./utils";

describe("get_value_labels", () => {
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

  it("returns the expected values and labels", () => {
    const value = get_value_labels(lots, "species_code", "species_name");

    const expected = [
      { value: "081", label: "Lake Trout (081)" },
      { value: "076", label: "Rainbow Trout (076)" },
      { value: "334", label: "Walleye (334)" },
    ];
    expect(expected).toEqual(value);
  });

  it("sorts the return values if in reverse order if descending is true", () => {
    const value = get_value_labels(lots, "species_code", "species_name", true);

    const expected = [
      { value: "334", label: "Walleye (334)" },
      { value: "076", label: "Rainbow Trout (076)" },
      { value: "081", label: "Lake Trout (081)" },
    ];
    expect(expected).toEqual(value);
  });

  it("includes a null value option in the list of values and choices", () => {
    const value = get_value_labels(
      lots,
      "species_code",
      "species_name",
      true,
      "---",
    );

    const expected = [
      { value: "", label: "---" },
      { value: "334", label: "Walleye (334)" },
      { value: "076", label: "Rainbow Trout (076)" },
      { value: "081", label: "Lake Trout (081)" },
    ];
    expect(expected).toEqual(value);
  });

  it("returns an empty array if data is empty", () => {
    const value = get_value_labels();
    expect(JSON.stringify(value)).toBe("[]");
  });
});

describe("parseSlug", () => {
  // an array with a single lot:
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
  ];

  it("returns expected values if a lot record is provided", () => {
    const slug = lots[0].slug;

    const value = parseLotSlug(lots, slug);

    // has the expected keys
    expect(value).toEqual({
      lot_num: expect.any(String),
      spawn_year: expect.any(Number),
      species: expect.any(String),
      strain: expect.any(String),
      rearing_location: expect.any(String),
    });

    // has the expected values in each key:
    expect(value["spawn_year"]).toEqual(2024);
    expect(value["lot_num"]).toEqual("240");
    expect(value["species"]).toEqual(
      `${lots[0].species_name} (${lots[0].species_code})`,
    );
    expect(value["strain"]).toEqual(
      `${lots[0].strain_name} (${lots[0].strain_code})`,
    );
    expect(value["rearing_location"]).toEqual(
      `${lots[0].rearing_location_name} (${lots[0].rearing_location_abbrev})`,
    );

    // has the expected value in each key:
  });

  it("returns an empty object if no lot is provided", () => {
    const slug = "foo";
    const lots = [];
    const value = parseLotSlug(lots, slug);
    expect(JSON.stringify(value)).toBe("{}");
  });
});
