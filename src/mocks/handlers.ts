import { http, HttpResponse } from "msw";

import {
  mockDevelopmentStages,
  mockFinClips,
  mockLots,
  mockProponents,
  mockRearingLocations,
  mockReleaseMethods,
  mockSpecies,
  mockStockingAdminUnits,
  mockStockingPurposes,
  mockStockingSites,
  mockStrains,
  mockTagColours,
  mockTagOrigins,
  mockTagPositions,
  mockTagTypes,
  mockTransitMethods,
  mockWaterbodies,
} from "./mockData";

import { baseUrl } from "../axiosInstance/constants";

const apiUrl = `${baseUrl}/stocking/api/v1`;

export const handlers = [
  http.get(`${apiUrl}/fin_clips/`, () => {
    return HttpResponse.json(mockFinClips);
  }),
  http.get(`${apiUrl}/development_stages/`, () => {
    return HttpResponse.json(mockDevelopmentStages);
  }),
  http.get(`${apiUrl}/lots/`, () => {
    return HttpResponse.json(mockLots);
  }),
  http.get(`${apiUrl}/proponents/`, () => {
    return HttpResponse.json(mockProponents);
  }),
  http.get(`${apiUrl}/rearing_locations/`, () => {
    return HttpResponse.json(mockRearingLocations);
  }),
  http.get(`${apiUrl}/release_methods/`, () => {
    return HttpResponse.json(mockReleaseMethods);
  }),
  http.get(`${apiUrl}/species/`, () => {
    return HttpResponse.json(mockSpecies);
  }),
  http.get(`${apiUrl}/stocking_admin_units/`, () => {
    return HttpResponse.json(mockStockingAdminUnits);
  }),
  http.get(`${apiUrl}/stocking_purposes/`, () => {
    return HttpResponse.json(mockStockingPurposes);
  }),
  http.get(`${apiUrl}/stocking_sites/`, () => {
    return HttpResponse.json(mockStockingSites);
  }),
  http.get(`${apiUrl}/strains/`, () => {
    return HttpResponse.json(mockStrains);
  }),
  http.get(`${apiUrl}/tag_colours/`, () => {
    return HttpResponse.json(mockTagColours);
  }),

  http.get(`${apiUrl}/tag_origins/`, () => {
    return HttpResponse.json(mockTagOrigins);
  }),

  http.get(`${apiUrl}/tag_positions/`, () => {
    return HttpResponse.json(mockTagPositions);
  }),
  http.get(`${apiUrl}/tag_types/`, () => {
    return HttpResponse.json(mockTagTypes);
  }),

  http.get(`${apiUrl}/transit_methods/`, () => {
    return HttpResponse.json(mockTransitMethods);
  }),

  http.get(`${apiUrl}/stocked_waterbodies/`, () => {
    return HttpResponse.json(mockWaterbodies);
  }),

  http.get(`${apiUrl}/destination_waterbodies/`, () => {
    return HttpResponse.json(mockWaterbodies);
  }),
];
