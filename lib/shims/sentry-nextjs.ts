type Scope = {
  setLevel: (level: string) => void;
  setFingerprint: (fingerprint: string[]) => void;
  setTags: (tags: Record<string, unknown>) => void;
  setExtra: (key: string, value: unknown) => void;
};

export type BrowserOptions = Record<string, unknown>;
export type ErrorEvent = Record<string, unknown>;
export type Breadcrumb = Record<string, unknown>;
export type Log = Record<string, unknown>;

export function getDefaultIntegrations(): unknown[] {
  return [];
}

export function replayIntegration(): unknown {
  return {};
}

export function makeFetchTransport(): unknown {
  return {};
}

export function pinoIntegration(_options?: unknown): unknown {
  return {};
}

export function withScope(callback: (scope: Scope) => void): void {
  callback({
    setLevel: () => {},
    setFingerprint: () => {},
    setTags: () => {},
    setExtra: () => {},
  });
}

export function captureException(_error: unknown): void {}

export function captureMessage(_message: string, _level?: string): void {}
