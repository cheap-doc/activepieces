import {
  AppConnectionValueForAuthProperty,
  createTrigger,
  TriggerStrategy,
} from '@activepieces/pieces-framework';
import {
  DedupeStrategy,
  HttpMethod,
  Polling,
  pollingHelper,
} from '@activepieces/pieces-common';
import { docCheapAuth } from '../auth';
import { docCheapClient } from '../common/client';
import { ScanList } from '../common/types';

const polling: Polling<
  AppConnectionValueForAuthProperty<typeof docCheapAuth>,
  Record<string, never>
> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth }) => {
    const list = await docCheapClient.sendRequest<ScanList>({
      apiKey: auth.secret_text,
      method: HttpMethod.GET,
      path: '/scans',
      queryParams: { limit: '100' },
    });
    return list.scans.map((scan) => ({
      epochMilliSeconds: Date.parse(scan.created_at),
      data: scan,
    }));
  },
};

export const newScan = createTrigger({
  auth: docCheapAuth,
  name: 'new_scan',
  classification: 'READ',
  displayName: 'New Scan',
  description: 'Triggers when a new scan result is stored in your account.',
  aiMetadata: {
    description:
      'Fires for each new doc.cheap scan stored in the account, emitting its summary: id, status, billed, duration_ms, reference and created_at. Polls the scan list and only surfaces scans created after the trigger was enabled. Only scans made with a live key and kept for a retention window above 0 hours are listed, so a sandbox key never fires it.',
  },
  props: {},
  sampleData: {
    id: '01a0af18-cd8d-7a61-9f2d-4c7b8e105da3',
    status: 'recognized',
    billed: true,
    duration_ms: 212,
    reference: 'order-1042',
    created_at: '2026-10-01T09:30:00Z',
  },
  type: TriggerStrategy.POLLING,
  async test(context) {
    return pollingHelper.test(polling, context);
  },
  async onEnable(context) {
    await pollingHelper.onEnable(polling, context);
  },
  async onDisable(context) {
    await pollingHelper.onDisable(polling, context);
  },
  async run(context) {
    return pollingHelper.poll(polling, context);
  },
});
