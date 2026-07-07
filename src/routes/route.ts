import { createActivities, getActivities_log } from "../controller/activities_log";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controller/category";
import { roleCheck } from "../middleware/checkRole";
import { requireAuth } from "../middleware/requireAuth";
import express from "express"
import { requirePermission } from "../middleware/requirePermission";
import { createMenuItem, getMenuItem, getSingleMenu } from "../controller/menuItem";
import { submitFeedback } from "../controller/feedback";
import { createTable, deleteTable, getTable, updateTable } from "../controller/table";

export const categoryRoute = express.Router();
export const activities = express.Router();
export const menuItem = express.Router();
export const tableRout = express.Router();

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

//menuItem

menuItem.post("/create", 
    requireAuth, 
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("create", "menu"),
    createMenuItem
);

menuItem.put("/update/:id",
    requireAuth,
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("update", "menu"),
    updateCategory
    
)

menuItem.delete("/delete/:id",
    requireAuth,
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("delete", "menu"),
    deleteCategory
)

menuItem.get("/get_all",
    requireAuth,
    getMenuItem
)

menuItem.get("/get_single/:id", 
    getSingleMenu
)

//feedback

menuItem.post("/:menuItemId/feedback",
    requireAuth,
    submitFeedback
)

//table
tableRout.post("/create",
    requireAuth,
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("create", "table"),
    createTable
);
tableRout.put("/update/:id",
    requireAuth,
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("update", "table"),
    updateTable
)

tableRout.delete("/delete/:id",
    requireAuth,
    roleCheck(["ADMIN", "MANAGER"]),
    requirePermission("delete", "table"),
    deleteTable
)

tableRout.get("/get_all", 
    requireAuth,
    getTable
)