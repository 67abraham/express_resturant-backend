import { createCategory, deleteCategory, getCategory, updateCategory } from "../controller/category";
import { requireAuth } from "../middleware/requireAuth";
import express from "express"

export const categoryRoute = express.Router();

categoryRoute.post("/create_category",requireAuth, createCategory);
categoryRoute.put("/update_category/:id",requireAuth, updateCategory);
categoryRoute.delete("/delete_category/:id",requireAuth, deleteCategory);
categoryRoute.get("/", getCategory);