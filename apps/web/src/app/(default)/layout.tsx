import { type ReactNode } from "react";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

type DefaultLayoutProps = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex w-full flex-grow flex-col">{children}</main>
      <Footer />
    </div>
  );
}
