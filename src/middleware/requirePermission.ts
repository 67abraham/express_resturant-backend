
//middleware to check if the user has the require permission

import type { NextFunction, Request, Response } from "express";
import type { allPermission } from "../../lib/permission";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { logger } from "better-auth";
import { prisma } from "../../lib/prisma";

const resource =[
    "category",
    "menu",
    "order",
    "table",
    "kds",
    "report",
    "user",
    "session"
] as const;


export const requirePermission = (permission: typeof allPermission[number], resources: (typeof resource[number]))=>{
    return async (req:Request, res:Response, next:NextFunction)=>{

       try {
         const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        })

        if(!session || !session.user){return res.status(401).json({msg: "Unauthorize. Please log in"})}

        const permissionRes = await auth.api.userHasPermission({
            headers: fromNodeHeaders(req.headers),
            body:{
                permissions: {
                    [resources] : [permission]
                }
            }
        })

        if (permissionRes.success){
            (req as any).user= session.user;
            (req as any).session = session.session;

            return next();
        }else{
            await prisma.activitiesLog.create({
                data:{
                   userId: session.user.id,
                   action: `${resources} : ${permission}`,
                   details: `Permission is Denied for ${session.user.email} on ${resources} : ${permission} ` 
                }
            })

            logger.error(`Permission Denied: ${permissionRes.error}`)
            return res.status(401).json({error: `Permission is Denied for ${session.user.email} on ${resources} : ${permission}`})

        }
        
       } catch (error) {
        logger.error(`Error: ${error}`)
        res.status(500).json({msg: "Internal Server Error"})
        
       }


    }


}