'use client'

import { gql, useQuery, useMutation } from "@apollo/client";
import RoleChange from "@/app/(app)/manage/components/roleChange";
import { toast } from "sonner"
import DeleteUser from "@/app/(app)/manage/components/deleteUser";


// Get all users
const GetUsers = gql`
    query GetUsers {
        getUsers {
            id
            firstName
            lastName
            email
            role
        }
    }
`

// Update user role by id
const UpdateUserRoleByID = gql`
    mutation UpdateUserRoleByID($updateUserRoleByIdId: ID!, $role: String!) {
        updateUserRoleByID(id: $updateUserRoleByIdId, role: $role) {
            id
            role
        }
    }
`

// Delete user by email
const DeleteUserByEmail = gql`
    mutation DeleteUserByEmail($email: String!) {
        deleteUserByEmail(email: $email) {
            id
        }
    }
`

const Index = () => {

    // ~~~~ Query and Mutation ~~~~
    const {data: users, loading: usersLoading} = useQuery(GetUsers); // Get all users
    const [updateUserRoleByID] = useMutation(UpdateUserRoleByID, {
        refetchQueries: [{query: GetUsers}]
    });  // Update user role by id
    const [deleteUserByEmail] = useMutation(DeleteUserByEmail, {
        refetchQueries: [{query: GetUsers}]
    });  // Delete user by email


    // Change user role
    const ChangeRole = async (role: string, id: string) => {
        console.log(role, id);
        try {
            await updateUserRoleByID({
                variables: {
                    updateUserRoleByIdId: id,
                    role: role
                }
            });

            // Notify user
            toast('Role Updated successfully', {
                duration: 2000,
            })


        } catch (e) {
            console.log(e);
        }
    }

    // Delete user
    const DeleteUserByEmail_ = async (email: string) => {
        try {
            await deleteUserByEmail({
                variables: {
                    email: email
                }
            });

            // Notify user
            toast('User Deleted successfully', {
                duration: 2000,
            })

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div
            className={'grid sm:grid-cols-2 gap-4'}
        >
            {
                usersLoading && (
                    <div
                        className={'sm:col-span-2 text-3xl text-center text-gray-500'}
                    >
                        Loading...
                    </div>
                )
            }
            {
                users ?
                    users.getUsers.map((user: {
                        id: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                        role: string;
                    }) => (
                        <div
                            key={user.id}
                            className={'flex sm:flex-row flex-col gap-4 sm:gap-0 justify-between items-center rounded-2xl p-2 shadow-xl duration-200 hover:bg-slate-50'}
                        >
                            <div className="text-center sm:text-left">

                                <h1
                                    className={'text-base sm:text-xl font-semibold'}
                                >
                                    {user.firstName} {user.lastName}
                                </h1>

                                <p
                                    className={'text-sm sm:text-base text-gray-500'}
                                >
                                    {user.email}
                                </p>

                            </div>

                            <div className="flex gap-2 items-center">

                                <RoleChange
                                    defaultValue={user.role}
                                    setValue={(value) => ChangeRole(value, user.id)}
                                />

                                <DeleteUser
                                    deleteUser={() => DeleteUserByEmail_(user.email)}
                                />

                            </div>



                        </div>
                    ))
                :
                    null
            }

        </div>
    )
}

export default Index;