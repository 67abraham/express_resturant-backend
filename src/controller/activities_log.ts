import { string } from "better-auth";
import { logger } from "../../lib/logger";
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { activities_log } from "../../lib/activities-log";


export const getActivities_log = async(req:Request, res:Response)=>{
    try {

        const page = Math.max(1, parseInt(req.query.page as any) || 1)
        const limit = Math.max(1, parseInt(req.query.limit as any) || 10);

        const skip = (page -1) * limit;

        const [activities, totalActivities] = await Promise.all([
            prisma.activitiesLog.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.activitiesLog.count()
        ])

        const totalPage = Math.ceil(totalActivities / limit)


           await activities_log({
                    userId : (req as any).user?.id,
                    action: "GET_ACTIVITIES_LOG",
                    details: `Get all Log`
                })
        
        logger.info("Fetched Log")
        res.status(200).json({
            data: activities,
            totalActivities,
            itemsPerPage: limit,
            currentPage: page,
            totalPage,
            hasNextPage: page < totalPage,
            hasPrevPage: page > 1

        })

    } catch (error) {
        logger.info(`Error: ${error}`)
        res.status(500).json({msg: "Error Fetching Activity"})
        
    }
}

export const createActivities = async (req:Request, res: Response)=>{
    try {
        const {action, details} = req.body;

        if(!action || !details){
            return res.status(401).json({msg: " Data is Required"})
        }

        await activities_log({
            userId : (req as any).user?.id,
            action: action,
            details: details
        })

        logger.info("Create Activities_Log")
        res.status(201).json({msg: "Activity Log Created Successfully"})
        
    } catch (error) {
         logger.info(`Error: ${error}`)
        res.status(500).json({msg: "Error Creating Activity"})
    }
}