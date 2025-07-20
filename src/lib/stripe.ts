import { db } from "@/db";
import Stripe from "stripe";
import { getUserFromRequest } from "./auth";
import { PLANS } from "@/app/config/stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

export async function getUserSubscriptionPlan(userIdFromParams?: string) {
  const userFromRequest = await getUserFromRequest();
  const userId = userIdFromParams || userFromRequest?.id;

  if (!userId) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const dbUser = await db.user.findFirst({
    where: { id: userId },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const currentTime = Date.now();

  const isSubscribed =
    !!dbUser.stripePriceId &&
    !!dbUser.stripeCurrentPeriodEnd &&
    dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > currentTime;

  const isTestMode = process.env.NODE_ENV !== "production";
  const priceIdKey = isTestMode ? "test" : "production";

  const activePlan = isSubscribed
    ? PLANS.find(
        (plan) => plan.price.priceIds[priceIdKey] === dbUser.stripePriceId,
      )
    : PLANS[0];

  let isCanceled = false;

  if (isSubscribed && dbUser.stripeSubscriptionId) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(
        dbUser.stripeSubscriptionId,
      );
      isCanceled = stripeSub.cancel_at_period_end;
    } catch (error) {
      console.error("Failed to fetch Stripe subscription:", error);
    }
  }

  return {
    ...activePlan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
