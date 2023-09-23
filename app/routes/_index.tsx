import type { MetaFunction } from "@remix-run/node";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../components/ui/button";
import { authCheck } from "../models/privy";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { subscribeToPush } from "@remix-pwa/push";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { getPushSubsByUserId } from "../models/pushSubs";

export const meta: MetaFunction = () => {
  return { title: "Primix" };
};

// loader function
export const loader: LoaderFunction = async ({ request }) => {
  let authStatus = await authCheck(request);
  if (!authStatus) return redirect("/login");
  const pushSubs = await getPushSubsByUserId(authStatus.id);
  const hasPushSubs = pushSubs.length > 0;
  return json({
    authStatus: authStatus,
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    hasPushSubs: hasPushSubs,
  });
};

export default function Index() {
  const [subscribed, setSubscribed] = useState(false);
  const { user } = usePrivy();
  const [hasPushSubs, setPushSubs] = useState(useLoaderData().hasPushSubs);

  const VAPID_PUBLIC_KEY = useLoaderData().VAPID_PUBLIC_KEY;
  const subscribe = async () => {
    console.log("inside subscribe on client!");
    const subscription = await subscribeToPush(VAPID_PUBLIC_KEY, "/push").then(
      (res) => res.json(),
    );
    console.log(subscription);
    subscription.userId = user?.id;
    const response = await fetch("/pushSub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });
    setPushSubs(1);
    setSubscribed(true);
  };

  const { logout } = usePrivy();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // You can add any additional logic here that should run after logout
    return navigate("/login");
  };
  //const { login, ready, authenticated, user } = usePrivy();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full flex justify-end">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={handleLogout}
                className={navigationMenuTriggerStyle()}
              >
                Logout
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <main className="flex flex-grow justify-center mt-2">
        <div className="flex flex-col items-center">
          <h1 className="hidden md:block"> Stay tuned 😈 </h1>
          {!hasPushSubs && (
            <Button className="mt-2 md:hidden" onClick={subscribe}>
              Subscribe to notifications
            </Button>
          )}
          {hasPushSubs && <p>You are subscribed to push notifications</p>}
        </div>
      </main>
    </div>
  );
}
