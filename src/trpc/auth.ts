import { router, publicProcedure, privateProcedure } from "./trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

// so lets create a zod types for register and login for typeSafty//

const Email = z.string().email();
const Pass = z.string().min(8, "Password must be 8 char");
const Name = z.string().min(3).max(50);

// so lets create the router here for our process to handle login and register //

export const authRouter = router({
  register: publicProcedure
    .input(z.object({ name: Name, email: Email, password: Pass }))
    .mutation(async ({ input }) => {
      // so at the first lest see if the user is in our database or not ?
      const exists = await db.user.findUnique({
        where: { email: input.email },
      });

      // so in that case if the user is already exist lets retuen a error message //

      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email Already in Use",
        });

      // so then lets hash the password then to save it in our databse //
      const hashed = await bcrypt.hash(input.password, 10);

      // so finally lets create the user in the databse //

      const user = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashed,
        },
      });

      const jwt_secret = process.env.ACCESS_TOKEN_SECRET;
      if (!jwt_secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

      // so lets set the token here
      // at first we gonna use sign methood here via jwt with user id //

      const token = jwt.sign({ sub: user.id }, jwt_secret, { expiresIn: "7d" });

      // lets set the token and its name

      (await cookies()).set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return { success: true };
    }),

  // so lets create a login here

  login: publicProcedure
    .input(z.object({ email: Email, password: Pass }))
    .mutation(async ({ input }) => {
      // so lets so if this user already exist in our databse or not by its email //
      const user = await db.user.findUnique({ where: { email: input.email } });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "email or password is invalid please try again",
        });

      // so here lets see if the password is valid compare to what user is enter or not
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Email Or Password Please Try Again",
        });

      // so lets set token here also //

      const jwt_secret = process.env.ACCESS_TOKEN_SECRET;
      if (!jwt_secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

      const token = jwt.sign({ sub: user.id }, jwt_secret, { expiresIn: "7d" });

      (await cookies()).set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return { success: true };
    }),

  //finally add logout here //

  logout: privateProcedure.mutation(async () => {
    (await cookies()).delete("auth_token");
    return { success: true };
  }),

  me: privateProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        name: true,
        email: true,
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
    }

    return user;
  }),
});
