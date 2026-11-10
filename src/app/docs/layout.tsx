import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/docs/source";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DocsLayout
      tree={source.pageTree}
      themeSwitch={{
        enabled: false,
      }}
      nav={{
        title: "ドキュメンテーション"
      }}
    >
      {children}
    </DocsLayout>
  );
}
