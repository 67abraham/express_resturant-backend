import { logger } from "better-auth"
import { prisma } from "./prisma"

export const activities_log = async ({userId, action,details}:{userId:string, action:string, details:string})=>{
    try {
        
        const log = await prisma.activitiesLog.create({
            data:{
                userId,
                details,
                action,
            }
        })


    } catch (error) {
        logger.error(`Error: System Error => ${error}`)
    }
}