
/*
Resource - TODO_list

ROLES
* Owner - Full access to all resources -> create, read, update, delete
* User - Limited access to resources -> read
*/

// Authorization Policies
const POLICIES = {
    ADMIN: [
        "TODO::CREATE",
        "TODO::READ",
        "TODO::UPDATE",
        "TODO::DELETE"
    ],
    VIEWER: [
        "TODO::READ",
    ]
}

// Validate Permissions based on the role and action
export const ValidatePermissions = (role: string, resource: string, action: string) => {
    const permissions: string[] = POLICIES[role as keyof typeof POLICIES];

    // Check if the role has access to the resource
    if (!permissions) {
        return false;
    }

    return permissions.includes(`${resource}::${action}`);
}