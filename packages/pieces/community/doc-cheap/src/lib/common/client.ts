import {
  AuthenticationType,
  httpClient,
  HttpMethod,
  QueryParams,
} from '@activepieces/pieces-common';

const BASE_URL = 'https://api.doc.cheap/v1';

async function sendRequest<ResponseBody>({
  apiKey,
  method,
  path,
  body,
  headers,
  queryParams,
}: SendRequestParams): Promise<ResponseBody> {
  const response = await httpClient.sendRequest<ResponseBody>({
    method,
    url: `${BASE_URL}${path}`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: apiKey,
    },
    body,
    headers,
    queryParams,
  });
  return response.body;
}

function scanPath(scanId: string): string {
  return `/scans/${encodeURIComponent(scanId.trim())}`;
}

type SendRequestParams = {
  apiKey: string;
  method: HttpMethod;
  path: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  queryParams?: QueryParams;
};

export const docCheapClient = {
  baseUrl: BASE_URL,
  sendRequest,
  scanPath,
};
