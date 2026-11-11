import Link from "next/link";
import { getPageMap } from "nextra/page-map";
import type { PageMapItem } from "nextra";

type PageLink = {
  name: string;
  route: string;
  title?: string;
};

function getPageLinks(items: PageMapItem[]): PageLink[] {
  return items.flatMap((item) => {
    if (!("route" in item)) {
      return [];
    }

    if ("children" in item) {
      return getPageLinks(item.children);
    }

    if (item.route === "/docs") {
      return [];
    }

    const title = "frontMatter" in item ? item.frontMatter?.title : undefined;
    return [
      {
        name: item.name,
        route: item.route,
        title: typeof title === "string" ? title : undefined,
      },
    ];
  });
}

export default async function DocsPageList({
  className,
}: {
  className?: string;
}) {
  const pageMap = await getPageMap("/docs");
  const pages = getPageLinks(pageMap);

  return (
    <ul className={className}>
      {pages.map((page) => (
        <li key={page.route}>
          <Link href={page.route}>
            {page.title ?? page.name.replaceAll("-", " ")}
          </Link>
        </li>
      ))}
    </ul>
  );
}
