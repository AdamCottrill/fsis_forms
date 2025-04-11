import { http, HttpResponse } from "msw";

import { mockDevelopmentStages, mockFinClips } from "./mockData";

import { baseUrl } from "../axiosInstance/constants";

const apiUrl = `${baseUrl}/stocking/api/v1`;

export const handlers = [
  http.get(`${apiUrl}/fin_clips/`, () => {
    return HttpResponse.json(mockFinClips);
  }),
  http.get(`${apiUrl}/development_stages/`, () => {
    return HttpResponse.json(mockDevelopmentStages);
  }),
];
