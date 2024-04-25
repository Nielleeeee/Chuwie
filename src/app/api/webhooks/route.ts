import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import createUser from "@/app/actions/user/createUser";
import deleteUser from "@/app/actions/user/deleteUser";
import updateUser from "@/app/actions/user/updateUser";

const handleUserCreated = async (data: any) => {
  const createUserInfo = {
    clerk_id: data.id,
    email: data.email_addresses[0]?.email_address || "",
    username: data.username || "",
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    profile_picture: data.image_url || "",
  };

  const createdUser = await createUser(createUserInfo);

  if (createdUser?.id) {
    await clerkClient.users.updateUserMetadata(data.id, {
      publicMetadata: {
        user_id: createdUser.id,
      },
    });
  }
};

const handleUserUpdated = async (data: any) => {
  const updateUserInfo = {
    clerk_id: data.id,
    email: data.email_addresses[0]?.email_address || "",
    username: data.username || "",
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    profile_picture: data.image_url || "",
    user_id: data.public_metadata?.user_id || "",
  };

  const updatedUser = await updateUser(updateUserInfo);

  console.log("Updated User: ", updatedUser);
};

const handleUserDeleted = async (data: any) => {
  const clerk_id = data.id || "";
  const deletedUser = await deleteUser(clerk_id);

  console.log("Deleted User: ", deletedUser);
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      await handleUserCreated(evt.data);
      break;

    case "user.updated":
      await handleUserUpdated(evt.data);
      break;

    case "user.deleted":
      await handleUserDeleted(evt.data);
      break;

    default:
      console.error("Incorrect Event Type");
  }

  return new Response("", { status: 200 });
}
