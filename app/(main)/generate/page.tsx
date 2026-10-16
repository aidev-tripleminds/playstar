import type { Metadata } from "next";
import { Suspense } from "react";

import { GeneratePageView } from "./_components/generate-page-view";

export const metadata: Metadata = {
  title: "Generate",
  description: "Generate AI images and videos.",
};

type GeneratePageProps = {
  searchParams: Promise<{ character?: string | string[] }>;
};

export default function GeneratePage({ searchParams }: GeneratePageProps) {
  return (
    <Suspense fallback={null}>
      <GeneratePageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function GeneratePageContent({ searchParams }: GeneratePageProps) {
  const character = (await searchParams).character;
  const initialCharacterId =
    (Array.isArray(character) ? character[0] : character)?.trim() || undefined;

  return <GeneratePageView initialIsLoggedIn={false} initialCharacterId={initialCharacterId} />;
}
