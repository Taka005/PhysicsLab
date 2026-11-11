import type { ReactNode } from "react";
import Link from "next/link";
import DocsPageList from "./DocsPageList";
import "./docs.css";

export default async function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="docs-shell">
      <header className="docs-header">
        <Link className="docs-brand" href="/">
          PhysicsLab
        </Link>
        <Link className="docs-home-link" href="/">
          シミュレーターへ戻る
        </Link>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label="ドキュメント">
          <nav>
            <Link href="/docs">ドキュメント</Link>
            <DocsPageList className="docs-page-list docs-sidebar-list" />
          </nav>
        </aside>
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
