import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // styled-components: SSR + 번들에서 안정적으로 묶기
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ["styled-components"],
};

export default nextConfig;
