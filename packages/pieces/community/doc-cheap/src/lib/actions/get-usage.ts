import { createAction } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { docCheapAuth } from '../auth';
import { docCheapClient } from '../common/client';

export const getUsage = createAction({
  name: 'get_usage',
  classification: 'READ',
  auth: docCheapAuth,
  displayName: 'Get Usage',
  description: 'Get the credit balance and this month’s scan counts.',
  audience: 'both',
  aiMetadata: {
    description:
      'Returns the doc.cheap account’s remaining credit balance (null for keys without a balance), the current monthly period, the number of scans in it in total, billed and by status, and the credits spent. Read-only and idempotent.',
    idempotent: true,
  },
  props: {},
  async run(context) {
    return docCheapClient.sendRequest({
      apiKey: context.auth.secret_text,
      method: HttpMethod.GET,
      path: '/usage',
    });
  },
});
