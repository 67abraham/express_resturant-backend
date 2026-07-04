import type { NextFunction, Request, Response } from "express";
import { logger } from "../../lib/logger";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export type Role = "ADMIN" | "STAFF" | "KITCHEN" | "CUSTOMER" | "MANAGER"

export const roleCheck =(requireRole: Role[]) =>{
    return async (req:Request, res:Response, next:NextFunction)=>{

        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers)
            })
            //remove
            const u = (req as any).user.role
            logger.info(u)
            //
            if(!session){return res.status(401).json({msg: "Unauthorized"})}

            const userRole = (session.user as any).role;
            if(!requireRole.includes(userRole)){
                return res.status(403).json({msg: "Access Denied"})
            }

            (req as any).user = session.user
            next()
        } catch (error) {
            logger.error(`Error: ${error}`)
            res.status(500).json({msg: "Internal Server Server"})
            
        }
    }

}