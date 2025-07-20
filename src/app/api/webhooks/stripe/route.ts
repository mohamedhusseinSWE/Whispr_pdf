import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 },
    );
  }

  // ✅ Handle Checkout Session Completed (initial subscription)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string | undefined;

    if (!userId || !subscriptionId) {
      return new Response(null, { status: 200 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await db.user.update({
      where: { id: userId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
      },
    });
  }

  // ✅ Handle Subscription Canceled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await db.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripeSubscriptionId: null,
        stripePriceId: null,
      },
    });
  }

  return new Response(null, { status: 200 });
}
