import { useMDXComponents as getNextraComponents } from "nextra/mdx-components";
import type { MDXComponents } from "nextra/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...getNextraComponents(components),
    wrapper: ({ children }) => (
      <article className="docs-content">{children}</article>
    ),
  };
}
