import crypto from 'node:crypto';
import type { DiseaseResult } from '@yerlab/types';

export interface ScanRecord {
  id: string;
  userId: string;
  result: DiseaseResult;
  confidenceBand: string;
  createdAt: string;
}

// In-memory scan log (optional history / analytics). Bounded to avoid growth.
const scans: ScanRecord[] = [];
const MAX = 500;

export function logScan(userId: string, result: DiseaseResult): ScanRecord {
  const record: ScanRecord = {
    id: crypto.randomUUID(),
    userId,
    result,
    confidenceBand: result.confidence,
    createdAt: new Date().toISOString(),
  };
  scans.unshift(record);
  if (scans.length > MAX) scans.length = MAX;
  return record;
}

export function getUserScans(userId: string): ScanRecord[] {
  return scans.filter((s) => s.userId === userId);
}
