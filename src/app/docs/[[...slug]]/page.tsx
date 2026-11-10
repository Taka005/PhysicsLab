import { notFound } from "next/navigation";
import { DocsPage } from "fumadocs-ui/page";
import { source } from "@/lib/docs/source";
import { getMDXComponents } from "@/mdx-components";

export function generateStaticParams() {
  return source.generateParams();
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug?: string[];
  }>;
}) {
  const { slug = [] } = await params;

  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
    >
      <MDX components={getMDXComponents()} />
    </DocsPage>
  );
}
