import type { Request, Response } from "express";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import { activities_log } from "../../lib/activities-log";
import { TableStatus} from "../../generated/prisma/enums";
import { date, gte, lte } from "better-auth";


export const createTable = async(req:Request, res:Response)=>{

    try {
        const {tableName, seats, section, shape} = req.body


        if(!tableName || !seats || !section) return res.status(400).json({msg: "All Field is Required"});
        const existingTable = await prisma.table.findUnique({
            where: {tableName}
        })
        if(existingTable) return res.status(400).json({msg: "Table Exist"})
        const creatT = await prisma.table.create({
            data: {
                tableName,
                seats,
                shape,
                section,
                userId: (req as any).user.id
                
            }
        })

          await activities_log({
                            userId : (req as any).user?.id,
                            action: "CREATE_TABLE",
                            details: `create table: ${creatT.tableName}`
                        })
        
                logger.info(`Create table: ${creatT.tableName}`)
                res.status(201).json(creatT)
        
        
    } catch (error) {
          logger.error(`Error: Internal Server Error ${error}`)
            res.status(500).json({message: "Error: Internal Server Error"})
                 
    }
}

export const updateTable = async(req:Request, res:Response)=>{
    try {
        const {id} = req.params as {id:string}
          const {tableName, seats, section, shape} = req.body

        if(!tableName || !seats || !section) return res.status(401).json({msg: "All Field is Required"});

        const checkNameIfFoundDb= await prisma.table.findUnique({
            where: { tableName}
        })
        if(checkNameIfFoundDb) return res.status(400).json({msg: "Table Name already exist"})
        
        const updateT= await prisma.table.update({
            where: {id},
            data:{
                tableName,
                seats,
                shape,
                section
            }
        })
        await activities_log({
             userId : (req as any).user?.id,
            action: "UPDATE_TABLE",
            details: `UPDATE table: ${updateT.tableName}`
        })
        
                logger.info(`Update table: ${updateT.tableName}`)
                res.status(200).json(updateT)
        
        
    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
           
    }

}

export const deleteTable =async(req:Request, res:Response)=>{
    try {
        const {id}= req.params as {id:string}
        
        const del = await prisma.table.delete({
            where: {id}
        })

         await activities_log({
             userId : (req as any).user?.id,
            action: "Delete_TABLE",
            details: `Delete table: ${del.tableName}`
        })
        
                logger.info(`Deleted table: ${del.tableName}`)
                res.status(200).json({msg: "Table Deleted"})

    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
         
    }
}

export const getTable = async(req:Request, res:Response)=>{
    try {
        const page = Math.max(1, parseInt(req.query.page as any) || 1)
        const limit = Math.max(1, parseInt(req.query.limit as any)|| 10);

        const skip = (page -1) * limit;

        //reservation day
        const startDay= new Date();
        startDay.setHours(0,0,0,0);
        const endDay = new Date();
        endDay.setHours(23, 59, 59, 999);


        const availableTable = (req as any).user.role === "ADMIN" ? undefined:TableStatus.AVAILABLE;

        const table = await prisma.table.findMany({
            include:{
                reservation: {
                    where: {
                        data: {
                            gte: startDay,
                            lte: endDay
                        },
                        status: {in: ["PENDING", "CONFIRMED"]}
                    },
                    orderBy: {
                        date: "acs"
                    }
                }
            },
                 where: {tableStatus: availableTable},
                 skip: skip,
                 take: limit,
                 orderBy: {
                    tableName: "asc"
                 }
         });
     

     //const totalPage = Math.ceil(totalTable / limit);

         logger.info(`Get table`)
        res.status(200).json({
            table,
            //totalTable,
            skip,
            limit,
            hasPrevPage: page > 1,
          //  hasNextPage: page < totalPage

        })

    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
          
    }
}