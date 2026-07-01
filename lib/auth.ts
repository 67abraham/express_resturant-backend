import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import crypto from "crypto"


export const auth = betterAuth({
  database : prismaAdapter(prisma, {
    provider: "mongodb"
  }),
   advanced : {
    database : {
      generateId :()=> {
        return crypto.randomBytes(12).toString("hex");
      }
    }
   },

   emailAndPassword: {
    enabled: true, 
    autoSignIn: true
   },

   baseURL: process.env.BETTER_AUTH_URL, //redirect of the user
   trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],

   socialProviders: {
      google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
      },
   }

});