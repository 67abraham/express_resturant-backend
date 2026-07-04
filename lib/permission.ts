import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, userAc, defaultStatements } from "better-auth/plugins/admin/access";


export const allPermission = [
    "create",
    "read",
    "update",
    "delete",
    "cancel",
    "view",
    "ban",
    "get",
    "list",
    "set-role"
] as const;

//define your operation in your system
const statement = {
    ...defaultStatements,
    order: ["create", "read", "update", "delete", "cancel"],
    category: ["create", "read", "update", "delete"],
    table:["create", "read", "update", "delete"],
    menu: ["create", "read", "update", "delete"],
    kds: ["view", "update_state"], //kitchen display system
    report: ["view"], //Analytic and Financial

} as const;

export const accessControl = createAccessControl(statement);

// Create your custom Roles

export const ADMIN = accessControl.newRole({
    order: ["create", "read", "update", "delete", "cancel"],
    category: ["create", "read", "update", "delete"],
    menu: ["create", "read", "update", "delete"],
    table:["create", "read", "update", "delete"],
    kds: ["view", "update_state"], //kitchen display system
    report: ["view"], //Analytic and Financial
    
    ...adminAc.statements
});

export const MANAGER = accessControl.newRole({
    order: ["create", "read", "update", "delete", "cancel"],
    category: ["create", "read", "update", "delete"],
    menu: ["create", "read", "update", "delete"],
    table:["create", "read", "update", "delete"],
    kds: ["view", "update_state"], //kitchen display system
    report: ["view"], //Analytic and Financial

    ...userAc.statements

});

export const STAFF = accessControl.newRole({
    order: ["create", "read", "update",],
    category: ["read",],
    menu: ["read",],
    table: ["read", "update"],
    kds: ["view"], //kitchen display system
    report: [], //Analytic and Financial
    ...userAc.statements,

    
}) 

export const KITCHEN= accessControl.newRole({
    order: [ "read",],
    category: ["read",],
    menu: ["read",],
    table: ["read"],
    kds: ["view","update_state"], //kitchen display system
    report: [], //Analytic and Financial
    ...userAc.statements,
})

export const CUSTOMER = accessControl.newRole({
      order: ["create", "read", "cancel",],
    category: ["read",],
    menu: ["read",],
    table: ["read",],
    kds: [], //kitchen display system
    report: [], //Analytic and Financial
    ...userAc.statements,
})



