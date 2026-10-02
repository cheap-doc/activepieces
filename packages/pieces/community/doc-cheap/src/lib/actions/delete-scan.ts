import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { docCheapAuth } from '../auth';
import { docCheapClient } from '../common/client';

export const deleteScan = createAction({
  name: 'delete_scan',
  classification: 'DESTRUCTIVE',
  auth: docCheapAuth,
  displayName: 'Delete Scan',
  description: 'Delete a stored scan result before its retention window ends.',
  audience: 'both',
  aiMetadata: {
    description:
      'Permanently deletes one stored doc.cheap scan result by its scan ID and returns `{ id, deleted: true }`. The deletion cannot be undone. A scan that is unknown, already deleted or past its retention window answers 404 not_found, so a repeated call fails rather than succeeding twice.',
    idempotent: false,
  },
  props: {
    scanId: Property.ShortText({
      displayName: 'Scan ID',
      description: 'The `id` of the scan to delete.',
      required: true,
    }),
  },
  async run(context) {
    return docCheapClient.sendRequest({
      apiKey: context.auth.secret_text,
      method: HttpMethod.DELETE,
      path: docCheapClient.scanPath(context.propsValue.scanId),
    });
  },
});
