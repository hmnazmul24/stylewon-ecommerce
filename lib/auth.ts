import { account } from "@/auth-schema";
import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { hashPassword } from "better-auth/crypto";
import { emailOTP, phoneNumber } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
import { OTP_EXPIRE_IN_SECONDS } from "./constants";
import { sendSMS } from "./sms-service";
import { sendEmailLink, sendEmailOTP } from "./email-service";
import { admin } from "better-auth/plugins";

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
    async sendVerificationEmail(data, ctx) {
      console.log(ctx);

      await sendEmailLink({
        email: data.user.email,
        verifyUrl: data.url,
      });
      console.log("email varrification link =>", data);
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
        await sendSMS({ phoneNumber, code, type: "RESET_PASSWORD" });
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

      sendOTP: async ({ phoneNumber, code }, ctx) => {
        console.log("otp send to => ", phoneNumber, code);

        await sendSMS({ code, phoneNumber, type: "ACCOUNT_VERFICATION" });
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
        await sendEmailOTP({ email: data.email, otp: data.otp });
        console.log("email varification otp =>", data);
      },
    }),
    admin(),
  ],
});
