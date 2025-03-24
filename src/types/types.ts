export interface SelectChoice {
  label: string;
  value: string;
}

export interface CodeTable {
  id: number;
  code: string;
  description: string;
  fill_color: string;
}

export interface OptionsTable extends CodeTable {
  label: string;
  value: string;
}

export interface Fn2CodeTable extends CodeTable {
  fn2_code: string;
}

interface apiMeta {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PreLot {
  id: number;
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
}

export interface Lot extends PreLot {
  lot_id: number;
  strain_slug: string;
}

export interface CreatedLot {
  slug: string;
  lot_num: string;
  spawn_year: number;
  species_strain_id: string;
  proponent_id: string;
  rearing_location_id: string;
  funding_type: string;
}

export interface CreateLotFormInputs {
  lot_num: string;
  spc: string;
  species_strain_id: number;
  proponent_slug: string;
  rearing_location_id: number;
  spawn_year: number;
  funding_type: number;
}

export interface Species {
  id: number;
  spc: string;
  abbrev: string;
  spc_nm: string;
  spc_nmco: string;
  spc_nmsc: string;
  spc_lab: string;
  spc_nmfam: string;
  nhic_species_id: string;
  species_at_risk: string;
  fill_color: string;
  is_active: boolean;
}

export interface Strain {
  id: number;
  strain_name: string;
  strain_code: string;
  spc: string;
  spc_nmco: string;
  spc_nmsc: string;
  fill_color: string;
  is_active: string;
  slug: string;
}

export interface Proponent {
  id: number;
  proponent_name: string;
  proponent_abbrev: string;
  fill_color: string;
  is_active: string;
  slug: string;
}

export interface RearingLocation {
  id: number;
  name: string;
  abbrev: string;
  site_type: string;
  fill_color: string;
  is_active: string;
  slug: string;
}

export interface StockingAdminUnit {
  id: number;
  admin_unit_id: number;
  admin_unit_name: string;
  comment?: string;
  fill_color: string;
  is_active: boolean;
}

export interface Waterbody {
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

export interface StockingSite {
  id: number;
  waterbody_name: string;
  waterbody_wbylid: string;
  stocking_site_id: number;
  stocking_site_name: string;
  stocking_site_utm: string;
  dd_lat: number;
  dd_lon: number;
}
