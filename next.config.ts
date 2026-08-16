import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // If you want to load the dev server from another device on your local
  // network (e.g. testing on a phone via http://<your-lan-ip>:3000),
  // add that IP here — otherwise Next.js blocks those requests and the
  // page loads but never becomes interactive:
  // allowedDevOrigins: ["192.168.1.23"],
};

export default nextConfig;
