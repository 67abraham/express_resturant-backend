import { date, reddit } from "better-auth";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import type {Request, Response} from "express"
import { activities_log } from "../../lib/activities-log";



export const createCategory = async(req:Request, res: Response )=>{
    try{
        const {name} = req.body
        if(!name){ return res.status(400).json({message : "name is required"})}
        const checkExistingCate = await prisma.category.findUnique({ where : {name}});

        if(!checkExistingCate){
            const slung = name.toLowerCase().replace(/\s+/g, "-")
            const createCategory = await prisma.category.create({
                data: {name, slung}
            })

            await activities_log({
            userId : (req as any).user?.id,
            action: "CREATE_CATEGORY",
            details: `Update Category: ${createCategory.name}`
             })

            logger.info(`Category is created: ${name}`)

            res.status(201).json(createCategory)

        }else{
            logger.error("Name exist")
            return res.status(400).json({message: "name already exist"})
        }

    }catch(err){
        logger.error(`Error: Internal Server Error ${err}`)
        res.status(500).json({message : "Internal Server Error"})
    }

}

export const updateCategory = async (req:Request, res:Response)=>{
    try {
        const {id}= req.params as {id:string}
        const {name} = req.body;

        const checkExisting = await prisma.category.findUnique({where: {name}})
        if(checkExisting){ return res.status(400).json({msg: "Name already Exist"})}

        const slung = name.toLowerCase().replace(/\s+/g, "-")
        const updCategory = await prisma.category.update({
            where : {id},
            data: {name, slung}
        })

        await activities_log({
            userId : (req as any).user?.id,
            action: "UPDATE_CATEGORY",
            details: `Update Category: ${updCategory.name}`
        })

        logger.info("Category Updated")
        res.status(200).json(updCategory)


        
    } catch (error) {
         logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
        
    }

}

export const deleteCategory = async (req:Request, res:Response)=>{
    try{
        const {id} = req.params as {id: string}; 
        if(!id){return res.status(400).json({message: "Invalid Category"})};
        const deleC = await prisma.category.delete({where: {id}});

          await activities_log({
            userId : (req as any).user?.id,
            action: "DELETE_CATEGORY",
            details: `Delete Category: ${deleC.name}`
        })
        logger.info("Category is Deleted")
        res.status(200).json({msg: "Category Deleted"})


    }catch(err){
        logger.error(`Error: Internal Server Error ${err}`)
        res.status(500).json({message: "Error: Internal Server Error"})
    }
}

export const getCategory = async (req:Request, res: Response)=>{
    try {
        //pagenation
        const page = Math.max(1, parseInt(req.query.page as string)||1)
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10)

        //total data to skip
        const skip = (page - 1) *limit;

        //fetch the data
        const [categories, totalItem] = await Promise.all([
            prisma.category.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                     name: 'asc'
                 }
            }),
            prisma.category.count()
        ])

        //total pages
        const totalPages = Math.ceil(totalItem / limit);

          await activities_log({
            userId : (req as any).user?.id,
            action: "GET_CATEGORY",
            details: `Get all Category`
        })

        logger.info("Get All Category")

        res.status(200).json({
            data: categories,
            totalItem,
            itemsPerPage: limit,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1

        })
        
    } catch (error) {
         logger.error(`Error: Internal Server Error ${error}`)
        res.status(500).json({message: "Error: Internal Server Error"})
    }
}