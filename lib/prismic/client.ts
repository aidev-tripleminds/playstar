import {
  type Client,
  type ClientConfig,
  createClient as createPrismicClient,
} from "@prismicio/client";

import { resolveAccessToken, resolveRepositoryName } from "./config";

/**
 * Repository name — for the preview route (task 9) and Slice Machine
 * integration. Resolved on each call rather than cached, so it stays in sync
 * with `createClient()`'s own fail-loud behavior — see `./config.ts`.
 */
export function repositoryName(): string {
  return resolveRepositoryName();
}

/**
 * Builds the typed Prismic content client, reading the workspace/token from env vars.
 *
 * An explicit `accessToken` in `config` wins; anything else (key absent, or
 * present but `undefined` — which `@prismicio/client` cannot tell apart) falls
 * back to the env var. Spreading `config` last would let a caller passing
 * `{ accessToken: undefined }` silently wipe the token and turn an
 * authenticated read into an unexplained 401.
 */
export function createClient(config: ClientConfig = {}): Client {
  return createPrismicClient(repositoryName(), {
    ...config,
    accessToken: config.accessToken ?? resolveAccessToken(),
  });
}
