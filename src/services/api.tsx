export const getDevelopmentStages = async () => {
  const url = "stocking/api/v1/development_stages/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getFinClips = async () => {
  const url = "stocking/api/v1/fin_clips/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

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

export const getReleaseMethods = async () => {
  const url = "stocking/api/v1/release_methods/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getTransitMethods = async () => {
  const url = "stocking/api/v1/transit_methods/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
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

export const getWaterbodies = async (waterbody_like: string) => {
  let url = "stocking/api/v1/stocked_waterbodies/";
  if (waterbody_like) url += "?waterbody__like=" + waterbody_like;
  const payload = await fetch(url).then((res) => res.json());
  // the view is paginate

  const { results } = payload;
  const results2 = results.map((d) => ({
    value: d.waterbody_identifier,
    label: `${d.label} <${d.waterbody_identifier}>)`,
  }));

  return results2.sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const getStockingSites = async (site_name_like: string) => {
  // fetches data from the stocking_sites api endpoint and returns
  // a sorted array of objects with attributes value and label;
  let url = "stocking/api/v1/stocking_sites/";
  if (site_name_like) url += "?site_name__like=" + site_name_like;
  const payload = await fetch(url).then((res) => res.json());
  // the view is paginated

  const { results } = payload;
  const results2 = results.map((d) => ({
    value: d.id,
    label: `${d.stocking_site_name} [site_id=${d.id}] (${d.waterbody_name} <${d.waterbody_wbylid}>)`,
  }));

  return results2.sort((a, b) => (a.label > b.label ? 1 : -1));
};
