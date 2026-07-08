import type { Request, Response } from "express";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";


export const createReservedTable = async(req:Request, res:Response)=>{
    try {
        const {customerName, guest, tableId, date} = req.body
        const requestTime = new Date(date)
        const twoHourBefore = new Date(requestTime.getTime() -2 * 60 *60 *1000)
        const twoHourAfter = new Date(requestTime.getTime() +2 * 60 *60 *1000)

        const conflictingBooking = await prisma.reservation.findFirst({
            where: {
                tableId,
                status : {in: ["PENDING", "CONFIRMED"]},
                date: {
                    gte: twoHourBefore,
                    lte: twoHourAfter
                }
            }
            
        })

        if(conflictingBooking) return res.status(400).json({msg: "Table Already Booked around this time"});

        const createReservation = await prisma.reservation.create({
            data:{
                customerName: customerName || (req as any).user.name || "Guest",
                guest: Number(guest),
                tableId,
                date: requestTime,
                userId: (req as any).user.id
            },
            include: {
                table: true
            }
        })

    } catch (error) {
         logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
                 
    }
}