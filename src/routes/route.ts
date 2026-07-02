import express from "express"
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controller/category";

export const categoryRoute = express.Router();

categoryRoute.post("/create_category", createCategory);
categoryRoute.put("/update_category/:id", updateCategory);
categoryRoute.delete("/delete_category/:id", deleteCategory);
categoryRoute.get("/", getCategory);