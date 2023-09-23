/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",

  serverDependenciesToBundle: [/^@remix-pwa.*/, "@remix-pwa/push"],
  //serverDependenciesToBundle: ["all"],
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  postcss: true,
  serverModuleFormat: "cjs",
  tailwind: true,
  postcss: true,
  devServerPort: 8002,
};
