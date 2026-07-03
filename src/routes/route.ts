import { getActivities_log } from "../controller/activities_log";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controller/category";
import { requireAuth } from "../middleware/requireAuth";
import express from "express"

export const categoryRoute = express.Router();
export const activities = express.Router();

categoryRoute.post("/create_category",requireAuth, createCategory);
categoryRoute.put("/update_category/:id",requireAuth, updateCategory);
categoryRoute.delete("/delete_category/:id",requireAuth, deleteCategory);
categoryRoute.get("/", getCategory);

//activities

activities.get('/', requireAuth, getActivities_log)