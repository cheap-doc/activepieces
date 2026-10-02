export type ScanStatus =
  | 'recognized'
  | 'no_document_found'
  | 'unreadable'
  | 'unsupported_document'
  | 'rejected';

export type ScanSummary = {
  id: string;
  status: ScanStatus;
  billed: boolean;
  duration_ms: number;
  reference: string | null;
  created_at: string;
};

export type ScanList = {
  scans: ScanSummary[];
  next_cursor: string | null;
};
