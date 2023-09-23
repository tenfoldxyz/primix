import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export let action: ActionFunction = async ({ request }) => {
  const subscriptionData = await request.json();

  try {
    const pushSubscription = await prisma.pushSubscription.create({
      data: {
        endpoint: subscriptionData.endpoint,
        expirationTime: subscriptionData.expirationTime,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
        userId: subscriptionData.userId,
      },
    });

    return json(pushSubscription, { status: 200 });
  } catch (error) {
    return json(
      { error: "Failed to subscribe to push notifications" },
      { status: 500 },
    );
  }
};
