export const REQUEST_ID_HEADER = "x-request-id";

type LogBindings = Record<string, unknown>;

export type Logger = {
  error: (bindings: LogBindings, message?: string) => void;
  warn: (bindings: LogBindings, message?: string) => void;
  info: (bindings: LogBindings, message?: string) => void;
  child: (bindings: LogBindings) => Logger;
};

function write(level: "error" | "warn" | "info", bindings: LogBindings, message?: string) {
  const method = level === "info" ? "info" : level;
  console[method](message ?? level, bindings);
}

export function createLogger(_options?: unknown): Logger {
  const logger: Logger = {
    error: (bindings, message) => write("error", bindings, message),
    warn: (bindings, message) => write("warn", bindings, message),
    info: (bindings, message) => write("info", bindings, message),
    child: () => logger,
  };
  return logger;
}
