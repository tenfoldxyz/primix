import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { json } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useFetcher,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import stylesheet from "~/tailwind.css";
import posthog from "posthog-js";
import { withSentry } from "@sentry/remix";
import { PrivyProvider } from "@privy-io/react-auth";

import { useSWEffect } from "@remix-pwa/sw";

const handleLogin = (user) => {
  console.log(`User ${user.id} logged in!`);
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return {
    title: "Primix",
    "og:title": "Primix",
    description: "Let's build the future of the web together.",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const posthogAPIKey = process.env.POSTHOG_API_KEY;

  return json({
    posthogAPIKey: posthogAPIKey,
    privyAppID: process.env.PRIVY_APP_ID,
  });
};

export function Analytics() {
  const [posthogLoaded, setPosthogLoaded] = useState(false);
  const analyticsFetcher = useFetcher();
  const data = useLoaderData();
  const location = useLocation();

  useEffect(() => {
    if (data.posthogAPIKey) {
      posthog.init(data.posthogAPIKey, {
        api_host: "https://app.posthog.com",
        loaded: () => {
          setPosthogLoaded(true);
        },
      });
    }
  }, [location, data]);

  useEffect(() => {
    if (posthogLoaded) {
      posthog.capture("$pageview");
    }
  }, [posthogLoaded, location.pathname]);
  return <div />;
}

function App() {
  const privyAppID = useLoaderData().privyAppID;
  useSWEffect();

  return (
    <html lang="en" className="dark h-full bg-background font-generalSans">
      <head>
        <script> var global = global || window; </script>

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/ios-app-icon.png"></link>
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <PrivyProvider
          appId={privyAppID}
          onSuccess={handleLogin}
          config={{
            loginMethods: ["email", "wallet", "github", "twitter"],
            appearance: {
              theme: "dark",
              showWalletLoginFirst: false,
            },
          }}
        >
          <Outlet />
        </PrivyProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const error = useRouteError();
  return (
    <html lang="en" className="dark h-full w-full  bg-background">
      <head>
        <Meta />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col bg-background">
        <div className="flex-grow py-10">
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 xs:px-6">
              <h1 className="font-kurrent text-3xl text-primary">
                {error.status} :(
              </h1>
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

export default withSentry(App);
