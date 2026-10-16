import { socialLinks } from "@/components/common/Prismic/footer/footer.constants";
import { fetchLegalDocuments } from "@/lib/api/legal";
import { getFooterLinkGroups } from "@/lib/prismic/footer";

import { MainLayoutShell } from "./main-layout-shell";

type MainLayoutProps = {
  children: React.ReactNode;
};

export async function MainLayout({ children }: MainLayoutProps) {
  // Both sides degrade to empty rather than failing the layout that wraps every
  // `(main)` page: a backend outage costs the policies modal its list, a CMS
  // outage costs the sidebar its SOCIALS rail. `getFooterLinkGroups` already
  // swallows its own failures, so only the backend call needs the try.
  const [policies, linkGroups] = await Promise.all([
    fetchLegalDocuments().catch(() => []),
    getFooterLinkGroups(),
  ]);

  return (
    <MainLayoutShell policies={policies} socials={socialLinks(linkGroups)}>
      {children}
    </MainLayoutShell>
  );
}
