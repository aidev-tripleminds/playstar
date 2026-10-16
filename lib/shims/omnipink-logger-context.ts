export const REQUEST_ID_HEADER = "x-request-id";

type LogContext = { request_id?: string };

export function getLogContext(): LogContext | undefined {
  return undefined;
}

export function resolveRequestId(header: string | null): string {
  const trimmed = header?.trim();
  if (trimmed) return trimmed;
  return globalThis.crypto?.randomUUID?.() ?? "local-request";
}

export function runWithLogContext<T>(_context: LogContext, fn: () => T): T {
  return fn();
}
