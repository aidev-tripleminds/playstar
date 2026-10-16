import type { Metadata } from "next";
import { Suspense } from "react";

import { GeneratePageView } from "@/app/(main)/generate/_components/generate-page-view";

export const metadata: Metadata = {
  title: "Generate videos",
  description: "Generate AI videos.",
};

type GenerateVideoPageProps = {
  searchParams: Promise<{ character?: string | string[] }>;
};

export default function GenerateVideoPage({ searchParams }: GenerateVideoPageProps) {
  return (
    <Suspense fallback={null}>
      <GenerateVideoPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function GenerateVideoPageContent({ searchParams }: GenerateVideoPageProps) {
  const character = (await searchParams).character;
  const initialCharacterId =
    (Array.isArray(character) ? character[0] : character)?.trim() || undefined;

  return (
    <GeneratePageView
      initialIsLoggedIn={false}
      initialCharacterId={initialCharacterId}
      initialSectionTabId="videos"
    />
  );
}
