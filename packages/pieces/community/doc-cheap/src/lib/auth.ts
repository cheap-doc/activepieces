import { PieceAuth } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { docCheapClient } from './common/client';

export const docCheapAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description:
    'A live key (`sk_live_…`) from the doc.cheap cabinet, or `sk_sandbox_public` to try the piece without an account. See [API keys](https://doc.cheap/docs/concepts/api-keys-and-sessions).',
  required: true,
  validate: async ({ auth }) => {
    try {
      await docCheapClient.sendRequest({
        apiKey: auth,
        method: HttpMethod.GET,
        path: '/usage',
      });
      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API key. Check the key in your doc.cheap account.',
      };
    }
  },
});
