import type { Request, Response } from "express";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import { activities_log } from "../../lib/activities-log";


export const submitFeedback = async(req:Request, res:Response)=>{
    try {
        const {menuItemId} = req.params as {menuItemId: string}

        const {rating, comment} = req.body

        if(!rating || !comment){return res.status(401).json({mes: "All Field is Required"})}

        const saveFeedback = await prisma.feedbacks.create({
            data:{
                rating,
                comment,
                menuItemId,
                userId: (req as any).user.id
            }
        })

         await activities_log({
                            userId :(req as any).user?.id,
                            action: "CREATE FEEDBACK",
                            details: `Feedback: ${saveFeedback.comment}: ${saveFeedback.rating}`
                        })
        
    } catch (error) {
              logger.error(`Error: Internal Server Error ${error}`)
                res.status(500).json({message: "Error: Internal Server Error"})
                 
    }
}