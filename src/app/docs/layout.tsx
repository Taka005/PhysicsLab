import type { ReactNode } from "react";
import Link from "next/link";
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
            <Link href="/docs/getting-started">Getting Started</Link>
            <Link href="/docs/guide/installation">インストール方法</Link>
          </nav>
        </aside>
        <main className="docs-main">{children}</main>
      </div>
      <footer className="docs-footer">PhysicsLab</footer>
    </div>
  );
}
