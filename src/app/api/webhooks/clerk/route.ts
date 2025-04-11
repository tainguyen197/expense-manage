import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser } from "@/db/user";

export const runtime = "edge";

export async function POST(req: Request) {
  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;

  // Create new Svix instance with secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  // Verify payload with headers
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      // Do something with user created event
      console.log("User created event received");

      await createUser({
        id: event.data.id,
        name: `${event.data.last_name} ${event.data.first_name}` || "Unknown",
        avatar: event.data.image_url,
        createdAt: new Date(),
      });
      break;
    }
    case "user.deleted": {
      if (!event.data.id) {
        console.error("Error: No user ID in payload");
        return new Response("Error: No user ID in payload", {
          status: 400,
        });
      }

      // Do something with user deleted event
      console.log("User deleted event received");

      await deleteUser(event.data.id);

      break;
    }

    default:
      break;
  }

  return new Response("Webhook received", { status: 200 });
}
