interface CodeTable {
  id: number;
  code: string;
  description: string;
  fill_color: string;
}

interface OptionsTable extends CodeTable {
  label: string;
  value: string;
}

interface Fn2CodeTable extends CodeTable {
  fn2_code: string;
}

interface Lot {
  id: number;
  lot_id: number;
  lot_num: string;
  spawn_year: number;
  species_name: string;
  species_code: string;
  strain_name: string;
  strain_code: string;
  funding_type: string;
  proponent_name: string;
  proponent_abbrev: string;
  rearing_location_name: string;
  rearing_location_abbrev: string;
  is_active: boolean;
  slug: string;
  strain_slug: string;
}

interface StockingAdminUnit {
  id: number;
  admin_unit_id: number;
  admin_unit_name: string;
  comment?: string;
  fill_color: string;
  is_active: boolean;
}

interface Waterbody {
  id: number;
  label: string;
  ogf_id: string;
  waterbody_identifier: string;
  official_name: string;
  official_alternate_name: string;
  equivalent_french_name: string;
  unofficial_name: string;
  geographic_township_name: string;
  fishnet2_waterbody: string;
  dd_lat: number;
  dd_lon: number;
}

interface StockingSite {
  id: number;
  waterbody_name: string;
  waterbody_wbylid: string;
  stocking_site_id: number;
  stocking_site_name: string;
  stocking_site_utm: string;
  dd_lat: number;
  dd_lon: number;
}

export const getDevelopmentStages = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/development_stages/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export const getFinClips = async (): Promise<Array<Fn2CodeTable>> => {
  const url = "stocking/api/v1/fin_clips/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getLots = async (): Promise<Array<Lot>> => {
  const url = "stocking/api/v1/lots/";
  const payload = await fetch(url).then((res) => res.json());

  const { results } = payload;

  const results2 = results.map((x) => ({
    ...x,
    strain_slug: `${x.species_code}-${x.strain_code}`,
    lot_id: x.id,
  }));
  return { ...payload, results: results2 };
};

export const getReleaseMethods = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/release_methods/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export const getTransitMethods = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/transit_methods/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getTagTypes = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_types/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export const getTagColours = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_colours/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export const getTagOrigins = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_origins/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export const getTagPositions = async (): Promise<Array<OptionsTable>> => {
  const url = "stocking/api/v1/tag_positions/";
  const payload = await fetch(url).then((res) => res.json());
  const payload2 = payload.map((x) => ({
    ...x,
    value: x.code,
    label: `${x.description} (${x.code})`,
  }));

  return payload2;
};

export const getStockingAdminUnits = async (): Promise<
  Array<StockingAdminUnit>
> => {
  const url = "stocking/api/v1/stocking_admin_units/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getStockingPurposes = async (): Promise<Array<CodeTable>> => {
  const url = "stocking/api/v1/stocking_purposes/";
  const payload = await fetch(url).then((res) => res.json());
  return payload;
};

export const getWaterbodies = async (
  waterbody_like: string,
): Promise<Array<Waterbody>> => {
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

export const getStockingSites = async (
  site_name_like: string,
): Promise<Array<StockingSite>> => {
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
