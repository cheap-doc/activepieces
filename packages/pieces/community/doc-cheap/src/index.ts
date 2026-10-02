import { createPiece, PieceCategory } from '@activepieces/pieces-framework';
import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { docCheapAuth } from './lib/auth';
import { docCheapClient } from './lib/common/client';
import { recognizeDocument } from './lib/actions/recognize-document';
import { findScan } from './lib/actions/find-scan';
import { deleteScan } from './lib/actions/delete-scan';
import { getUsage } from './lib/actions/get-usage';
import { newScan } from './lib/triggers/new-scan';

export const docCheap = createPiece({
  displayName: 'doc.cheap',
  description:
    'Read passports, ID cards and driver’s licences into JSON – $0.01 each.',
  auth: docCheapAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://doc.cheap/apple-touch-icon.png',
  categories: [PieceCategory.DEVELOPER_TOOLS, PieceCategory.CONTENT_AND_FILES],
  authors: ['cheap-doc'],
  actions: [
    recognizeDocument,
    findScan,
    deleteScan,
    getUsage,
    createCustomApiCallAction({
      auth: docCheapAuth,
      baseUrl: () => docCheapClient.baseUrl,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [newScan],
});
