export const getLots = async () => {
  const url = "stocking/api/v1/lots/";
  const payload = await fetch(url).then((res) => res.json());

  const { results } = payload;

  const results2 = results.map((x) => ({
    ...x,
    strain_slug: `${x.species_code}-${x.strain_code}`,
  }));
  return { ...payload, results: results2 };
};

export const getStockingAdminUnits = async () => {
  const url = "stocking/api/v1/stocking_admin_units/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getStockingPurposes = async () => {
  const url = "stocking/api/v1/stocking_purposes/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getTransitMethods = async () => {
  const url = "stocking/api/v1/transit_methods/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getReleaseMethods = async () => {
  const url = "stocking/api/v1/release_methods/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};
