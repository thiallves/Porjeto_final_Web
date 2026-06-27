import type { ListParams } from '@/src/types/api';

export function cleanParams(params: ListParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}
