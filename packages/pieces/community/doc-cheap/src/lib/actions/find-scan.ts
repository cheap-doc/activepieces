import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { docCheapAuth } from '../auth';
import { docCheapClient } from '../common/client';

export const findScan = createAction({
  name: 'find_scan',
  classification: 'READ',
  auth: docCheapAuth,
  displayName: 'Find Scan',
  description: 'Read back a stored scan result by its ID.',
  audience: 'both',
  aiMetadata: {
    description:
      'Returns one stored doc.cheap scan result by its scan ID, with the same fields as Recognize Document but without images. Only scans made with a live key and kept for a retention window above 0 hours can be found, and only until that window ends; otherwise the API answers 404 not_found. Read-only and idempotent.',
    idempotent: true,
  },
  props: {
    scanId: Property.ShortText({
      displayName: 'Scan ID',
      description: 'The `id` returned by Recognize Document or by the New Scan trigger.',
      required: true,
    }),
  },
  async run(context) {
    return docCheapClient.sendRequest({
      apiKey: context.auth.secret_text,
      method: HttpMethod.GET,
      path: docCheapClient.scanPath(context.propsValue.scanId),
    });
  },
});
