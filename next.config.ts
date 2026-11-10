import type { NextConfig } from "next";
import nextra from "nextra";

const nextConfig: NextConfig = {
  reactStrictMode: false,
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