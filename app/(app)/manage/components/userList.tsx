'use client'

import { gql, useQuery, useMutation } from "@apollo/client";
import RoleChange from "@/app/(app)/manage/components/roleChange";
import { toast } from "sonner"


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

const Index = () => {

    const {data: users, loading: usersLoading} = useQuery(GetUsers);
    const [updateUserRoleByID] = useMutation(UpdateUserRoleByID, {
        refetchQueries: [{query: GetUsers}]
    });


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

    return (
        <div
            className={'grid grid-cols-2 gap-4'}
        >
            {
                usersLoading && (
                    <div
                        className={'col-span-4 text-3xl text-center text-gray-500'}
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
                            className={'flex justify-between items-center rounded-2xl p-2 shadow-xl duration-200 hover:bg-slate-50'}
                        >
                            <div className="">

                                <h1
                                    className={'text-xl font-semibold'}
                                >
                                    {user.firstName} {user.lastName}
                                </h1>

                                <p
                                    className={'text-gray-500'}
                                >
                                    {user.email}
                                </p>

                            </div>

                            <RoleChange
                                defaultValue={user.role}
                                setValue={(value) => ChangeRole(value, user.id)}
                            />

                        </div>
                    ))
                :
                    null
            }

        </div>
    )
}

export default Index;