import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { logger } from "../../lib/logger";
import { auth } from "../../lib/auth";
import { activities_log } from "../../lib/activities-log";


export const requireAuth = async (req:Request, res:Response, next: NextFunction)=>{

    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
            
        })

        if(!session || !session.user){
           return res.status(401).json({msg: "Unauthorized"})
        }

        (req as any).user= session.user;
        (req as any).session = session.session;

          await activities_log({
                    userId : session.user.id,
                    action: "VERIFIED_USER_LOGIN",
                    details: `User is authenticated: ${session.user.email}`
                });
        return next();
    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
                res.status(500).json({message: "Error: Internal Server Error"})
    }

}