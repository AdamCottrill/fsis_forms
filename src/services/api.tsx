import {
  CodeTable,
  OptionsTable,
  Fn2CodeTable,
  Lot,
  Proponent,
  RearingLocation,
  Species,
  Strain,
  StockingAdminUnit,
  Waterbody,
  StockingSite,
} from "types";

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

export const getProponents = async (): Promise<Array<Proponent>> => {
  const url = "stocking/api/v1/proponents/";

  const payload = await fetch(url).then((res) => res.json());
  const { results } = payload;
  return results;
};

export const getRearingLocations = async (
  proponent_slug?: string,
): Promise<Array<RearingLocation>> => {
  //NOTE: this will be parameterized by proponent some day soon:
  let url = "stocking/api/v1/rearing_locations/";
  if (typeof proponent_slug !== "undefined") {
    url += `?proponent=${proponent_slug}`;
  }

  const payload = await fetch(url).then((res) => res.json());

  const { results } = payload;

  return results;
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

export const getSpecies = async (): Promise<Array<Species>> => {
  const url = "stocking/api/v1/species/";
  const payload = await fetch(url).then((res) => res.json());

  const { results } = payload;

  return results;
};

export const getStrains = async (spc?: string): Promise<Array<Strain>> => {
  //NOTE: this will be parameterized by species some day soon:
  let url = "stocking/api/v1/strains/";

  if (typeof spc !== "undefined") {
    url += `?spc=${spc}`;
  }

  const payload = await fetch(url).then((res) => res.json());

  const { results } = payload;

  return results;
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
