import { createActivities, getActivities_log } from "../controller/activities_log";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controller/category";
import { roleCheck } from "../middleware/checkRole";
import { requireAuth } from "../middleware/requireAuth";
import express from "express"

export const categoryRoute = express.Router();
export const activities = express.Router();

categoryRoute.post("/create_category",requireAuth, roleCheck(["ADMIN", "MANAGER"]), createCategory);
categoryRoute.put("/update_category/:id",requireAuth, roleCheck(["ADMIN", "MANAGER"]),updateCategory);
categoryRoute.delete("/delete_category/:id",requireAuth, roleCheck(["ADMIN", "MANAGER"]),deleteCategory);
categoryRoute.get("/", getCategory);

//activities

activities.get('/', requireAuth, getActivities_log)
activities.get('/create', requireAuth, createActivities)