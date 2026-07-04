import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import crypto from "crypto"
import { accessControl, ADMIN, CUSTOMER, KITCHEN, MANAGER, STAFF } from "./permission";
import { admin } from "better-auth/plugins";


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
    autoSignIn: true // automatically sing in user after they sign up
   },
   
   account:{
    accountLinking: {
      enabled: true
    }
   },

   baseURL: process.env.BETTER_AUTH_URL, //redirect of the user
   trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],

   socialProviders: {
      google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
      },
   },

   plugins : [
    admin({
      defaultRole : "CUSTOMER",
      ac: accessControl,
      roles:{
        ADMIN,
        MANAGER,
        STAFF,
        KITCHEN,
        CUSTOMER
      }
    })
    
   ],

   user: {
    additionalFields:{
      gender: {
        type: "string",
        required: false,
      },
      age: {
        type: 'string',
        required: false
      },
      status: {
        type: "string",
        required:false,
        defaultValue:"active"
      }
    }
   }

   

});