// push.ts
import { json, ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  // Load data here
  return json({ data: "Your data" }, { status: 200 });
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();
  console.log(body);

  const { type } = body;

  switch (type) {
    case "subscribe":
      console.log("subscribed");
      console.log(body.subscription);
      return json(body.subscription, {
        status: 201,
      });
    case "unsubscribe":
      console.log("unsubscribed");
      return json(true, {
        status: 200,
      });
  }

  return null;
};
