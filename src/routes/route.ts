import { createActivities, getActivities_log } from "../controller/activities_log";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controller/category";
import { roleCheck } from "../middleware/checkRole";
import { requireAuth } from "../middleware/requireAuth";
import express from "express"
import { requirePermission } from "../middleware/requirePermission";

export const categoryRoute = express.Router();
export const activities = express.Router();

categoryRoute.post("/create_category",
    requireAuth,
    requirePermission("create", "category"), 
    roleCheck(["ADMIN", "MANAGER"]), 
    createCategory);

categoryRoute.put("/update_category/:id",
    requireAuth, roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("update", "category"), 
    updateCategory);

categoryRoute.delete("/delete_category/:id",
    requireAuth, 
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("delete", "category"), 
    deleteCategory);
    
categoryRoute.get("/", getCategory);

//activities

activities.get('/', requireAuth, roleCheck(["ADMIN", "MANAGER"]), getActivities_log)
activities.get('/create', requireAuth, roleCheck(["ADMIN", "MANAGER"]), createActivities)