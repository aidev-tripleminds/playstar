import { PlaystarShell } from "@/components/layout/playstar-shell";

export default function MainRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PlaystarShell>{children}</PlaystarShell>;
}
