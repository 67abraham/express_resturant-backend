import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { activities_log } from "../../lib/activities-log";
import { logger } from "../../lib/logger";
import { allPermission } from "../../lib/permission";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";



export const createMenuItem= async (req:Request, res:Response)=>{
    try {
        const {name, description, price, discount, image, isAvailable, categoryId} =req.body

        if(!name || !description || !price || !categoryId){return res.status(401).json({msg: "Name, price, category and Discount are Required"})}

        const findCategory = await prisma.category.findUnique({where:{id:categoryId}})
        if(!findCategory){return res.status(401).json({msg: "Category is Not Found"})}
       
        const createMenu= await prisma.menuItem.create({
            data:{
                name,
                description,
                price,
                discount,
                image,
                categoryId,
                isAvailable
                
            }
        })
          await activities_log({
                    userId : (req as any).user?.id,
                    action: "CREATE_MENU_ITEM",
                    details: `CREATE ITEM: ${createMenu.name}`
                })

        logger.info(`MenuItem Created: ${createMenu.name}`)
        res.status(201).json(createMenu)
        
    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
        
        
    }
}

export const updateMenuItem = async( req:Request, res:Response)=>{
    try {

        const {id} = req.params as {id:string}
        const {name, description, price, discount, image, isAvailable, categoryId} =req.body

        if(!name || !description || !price || !categoryId){return res.status(401).json({msg: "Name, price, category and Discount are Required"})}
       
        const updateItem = await prisma.menuItem.update({
            where: {id},
            data: {
                name,
                description,
                isAvailable,
                image,
                categoryId,
                discount,
                price
            }
        })
          await activities_log({
                    userId : (req as any).user?.id,
                    action: "UPDATE_MENU_ITEM",
                    details: `UPDATE ITEM: ${updateItem.name}`
                })

        logger.info(`MenuItem Updated: ${updateItem.name}`)
        res.status(200).json(updateItem)


        
    } catch (error) {
        logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
        
    }
}

export const deleteMenuItem = async(req:Request, res:Response)=>{
    try {
        const {id}= req.params as {id:string}

        const deleMenuItem = await prisma.menuItem.delete({
            where : {id}
        })


          await activities_log({
                    userId : (req as any).user?.id,
                    action: "DELETE_MENU_ITEM",
                    details: `DELETE ITEM: ${deleMenuItem.name}`
                })

        logger.info(`MenuItem Deleted: ${deleMenuItem.name}`)
        res.status(201).json({msg: "Items is Deleted Successfully"})

        
    } catch (error) {
       logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
         
    }
}

export const getMenuItem = async(req:Request, res:Response)=>{
    try {

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        })
        logger.info("session is ok")
        const page = Math.max(1, parseInt(req.query.page as any)|| 1);
        const limit = Math.max(1, parseInt(req.query.limit as any)||10);

        const skip = (page - 1) *limit;

        logger.info("calculation is ok")

        const whereClause = {isAvailable: session?.user?.role === "ADMIN" ? undefined : true}
        logger.info("whereClause is ok")
        const [getMenu, totalItem] = await Promise.all([
            prisma.menuItem.findMany({
                skip: skip,
                take: limit,
                orderBy:{
                    name: 'asc'
                },
                where: whereClause,
                include:{
                    feedback: {
                        select:{rating: true}
                    },

                
                }
            }),
            prisma.menuItem.count({where: whereClause})
        ]);

        const totalPage = Math.ceil(totalItem / limit);
        logger.info("database query is ok")

        const menuItemWithRate= getMenu.map((item)=>{

            const totalRatings = item.feedback.reduce((sum, f)=> sum + f.rating as any, 0);

            const averageRate = item.feedback.length > 0 ? totalItem / item.feedback.length : 0;
        })


         await activities_log({
                    userId : session?.user?.id as any,
                    action: "GET_MENU_ITEM",
                    details: `GET ALL ITEM`
                })

        logger.info("FETCH ALL ITEM")
        res.status(200).json(
            {
                data: getMenu,
                totalPage,
                skip: skip,
                limit: limit,
                hasNextPage: page < totalPage,
                hasPrevPage: page > 1
            }
        )

        
    } catch (error) {
         logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
         
    }
}

export const getSingleMenu = async (req:Request, res:Response)=>{
    try {
        const {id} = req.params as {id:string}

        const getSingleItem = await prisma.menuItem.findUnique({
            where: {id},
            include:{
                category: true
            }
        })

         await activities_log({
                    userId : (req as any).user?.id,
                    action: "GET_SINGLE_MENU_ITEM",
                    details: `GET SINGLE ITEM ${getSingleItem?.name}`
                })
        
                logger.info(`Get Single Item: ${getSingleItem?.name}`)
                res.status(200).json(getSingleItem)


        
    } catch (error) {
          logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
         
    }
}
