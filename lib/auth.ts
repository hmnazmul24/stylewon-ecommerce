import { account } from "@/auth-schema";
import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { hashPassword } from "better-auth/crypto";
import { emailOTP, phoneNumber } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
import { OTP_EXPIRE_IN_SECONDS } from "./constants";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  emailVerification: {
    async sendVerificationEmail(data) {
      console.log("email varrification link =>", data.url);
    },
  },

  user: {
    changeEmail: {
      enabled: true,
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      update: {
        after: async (user, ctx) => {
          if (ctx?.path === "/verify-email") {
            await db
              .delete(account)
              .where(
                and(
                  eq(account.userId, user.id),
                  eq(account.providerId, "google"),
                ),
              );
            console.log("prev social account is deleted:");
          }
        },
      },
    },
  },

  plugins: [
    phoneNumber({
      expiresIn: OTP_EXPIRE_IN_SECONDS,
      async sendPasswordResetOTP({ code, phoneNumber }, ctx) {
        console.log(
          "password request OTP and mobile number => ",
          code,
          phoneNumber,
        );
      },
      async callbackOnVerification(data, ctx) {
        const userId = data.user.id;
        const [isAccountExist] = await db
          .select()
          .from(account)
          .where(
            and(
              eq(account.userId, userId),
              eq(account.providerId, "credential"),
            ),
          );
        if (!isAccountExist) {
          const password = await hashPassword(
            process.env.DEFAULT_USER_PASSWORD!,
          );
          await db.insert(account).values({
            accountId: crypto.randomUUID().toString(),
            id: crypto.randomUUID().toString(),
            providerId: "credential",
            userId: data.user.id,
            password,
          });
        }
      },

      sendOTP: ({ phoneNumber, code }, ctx) => {
        console.log("otp send to => ", phoneNumber, code);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@my-site.com`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
    emailOTP({
      expiresIn: OTP_EXPIRE_IN_SECONDS,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP(data, ctx) {
        console.log("email varification otp =>", data);
      },
    }),
  ],
});
