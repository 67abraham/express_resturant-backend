import type { Request, Response } from "express";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import { activities_log } from "../../lib/activities-log";


export const submitFeedback = async(req:Request, res:Response)=>{
    try {
        const {menuItemId} = req.params as {menuItemId: string}

        const {rating, comment} = req.body

        if( rating < 1 || rating > 5 ){return res.status(401).json({mes: "Rate must be between 1 and 5"})}

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

        logger.info(`Feedback: ${saveFeedback.comment}: ${saveFeedback.rating}`)
        res.status(201).json(saveFeedback)
        
    } catch (error) {
              logger.error(`Error: Internal Server Error ${error}`)
                res.status(500).json({message: "Error: Internal Server Error"})
                 
    }
}

export const deleFeedback = async(req:Request, res:Response)=>{
    try {
        const{id} = req.params as {id:string}

        const del = await prisma.feedbacks.delete({
            where: {id}
        })

        await activities_log({
                            userId :(req as any).user?.id,
                            action: "DELETE_FEEDBACK",
                            details: `delete feedback: ${id}`
                        })

        logger.info(`Feedback Deleted`)
        res.status(201).json({msg: "Feedback Deleted Successful"})


        
    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
         res.status(500).json({message: "Error: Internal Server Error"})
                 
    }
}