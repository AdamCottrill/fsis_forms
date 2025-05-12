import { http, HttpResponse } from "msw";

import {
  mockDevelopmentStages,
  mockFinClips,
  mockFieldDetail,
  mockLots,
  mockProponents,
  mockRearingLocations,
  mockReleaseMethods,
  mockSpecies,
  mockStockingAdminUnits,
  mockStockingPurposes,
  mockStockingSites,
  mockStrains,
  mockTableDetail,
  mockTagColours,
  mockTagOrigins,
  mockTagPositions,
  mockTagTypes,
  mockTransitMethods,
  mockWaterbodies,
} from "./mockData";

import { baseUrl } from "../axiosInstance/constants";

export const apiUrl = `${baseUrl}/stocking/api/v1`;
export const dataDictUrl = `${baseUrl}/data_dictionary/api/v1`;

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
  http.get(`${apiUrl}/stocking_sites/`, ({ request }) => {
    const url = new URL(request.url);

    const nameLike = url.searchParams.get("site_name__like");

    if (nameLike) {
      const { results } = mockStockingSites;
      const filtered = results.filter(
        (x) =>
          x.stocking_site_name.toLowerCase().indexOf(nameLike.toLowerCase()) >=
          0,
      );
      return HttpResponse.json({
        ...mockStockingSites,
        results: filtered,
        count: filtered.length,
      });
    } else {
      return HttpResponse.json(mockStockingSites);
    }
  }),

  http.get(`${apiUrl}/strains/`, ({ request }) => {
    const url = new URL(request.url);

    const spc = url.searchParams.get("spc");

    if (spc) {
      const { results } = mockStrains;
      const filtered = results.filter((x) => x.spc === spc);
      return HttpResponse.json({
        ...mockStrains,
        results: filtered,
        count: filtered.length,
      });
    } else {
      return HttpResponse.json(mockStrains);
    }

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

  http.get(`${apiUrl}/stocked_waterbodies/`, ({ request }) => {
    const url = new URL(request.url);

    const waterbodyLike = url.searchParams.get("waterbody__like");

    if (waterbodyLike) {
      const { results } = mockWaterbodies;
      const filtered = results.filter(
        (x) => x.label.toLowerCase().indexOf(waterbodyLike.toLowerCase()) >= 0,
      );
      return HttpResponse.json({
        ...mockWaterbodies,
        results: filtered,
        count: filtered.length,
      });
    } else {
      return HttpResponse.json(mockWaterbodies);
    }
  }),

  http.get(`${apiUrl}/destination_waterbodies/`, ({ request }) => {
    const url = new URL(request.url);

    const waterbodyLike = url.searchParams.get("waterbody__like");

    if (waterbodyLike) {
      const { results } = mockWaterbodies;
      const filtered = results.filter(
        (x) => x.label.toLowerCase().indexOf(waterbodyLike.toLowerCase()) >= 0,
      );
      return HttpResponse.json({
        ...mockWaterbodies,
        results: filtered,
        count: filtered.length,
      });
    } else {
      return HttpResponse.json(mockWaterbodies);
    }
  }),

  http.post(`${apiUrl}/lot/create/`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.get(`${dataDictUrl}/field/*`, () => {
    return HttpResponse.json(mockFieldDetail);
  }),

  http.get(`${dataDictUrl}/table/*`, () => {
    return HttpResponse.json(mockTableDetail);
  }),
];
