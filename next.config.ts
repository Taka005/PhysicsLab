import type { NextConfig } from "next";
import nextra from "nextra";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_BASE_PATH ?? "",
  output: "export",
  images: {
    unoptimized: true,
  }
};

const withNextra = nextra({
  contentDirBasePath: "/docs",
  search: false,
});

export default withNextra(nextConfig);