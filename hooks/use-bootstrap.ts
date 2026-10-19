"use client";

export const BOOTSTRAP_QUERY_KEY = ["bootstrap"] as const;

const LOCAL_BOOTSTRAP = {
  auth: { google: null },
};

/** Local brand config. Nothing is requested from the backend. */
export function useBootstrap() {
  return {
    data: LOCAL_BOOTSTRAP,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: true,
    isFetched: true,
    status: "success" as const,
    refetch: async () => ({ data: LOCAL_BOOTSTRAP }),
  };
}

export function useGoogleProviderId(): string | null {
  return null;
}
