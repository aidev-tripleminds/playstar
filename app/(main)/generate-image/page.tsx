import type { Metadata } from "next";
import { Suspense } from "react";

import { GeneratePageView } from "@/app/(main)/generate/_components/generate-page-view";

export const metadata: Metadata = {
  title: "Generate images",
  description: "Generate AI images.",
};

type GenerateImagePageProps = {
  searchParams: Promise<{ character?: string | string[] }>;
};

export default function GenerateImagePage({ searchParams }: GenerateImagePageProps) {
  return (
    <Suspense fallback={null}>
      <GenerateImagePageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function GenerateImagePageContent({ searchParams }: GenerateImagePageProps) {
  const character = (await searchParams).character;
  const initialCharacterId =
    (Array.isArray(character) ? character[0] : character)?.trim() || undefined;

  return (
    <GeneratePageView
      initialIsLoggedIn={false}
      initialCharacterId={initialCharacterId}
      initialSectionTabId="images"
    />
  );
}
