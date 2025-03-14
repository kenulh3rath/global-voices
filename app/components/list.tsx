'use client'

import { useQuery, useMutation, gql } from "@apollo/client";
import {ValidatePermissions} from "@/lib/authz";
import {Button} from "@/components/ui/button";

interface Props {
    user: {
        name: string
        age: number
        email: string
        role: string
    }
}

// Define Todo_types
type todos_type = {
    id: string
    title: string
    description: string
}
const Get_TODOs = gql`
    query GetList {
        getTodoLists {
            id
            title
            description
        }
    }
`

const DELETE_TODO = gql`
    mutation DeleteTODO($id: ID!) {
        deleteTodoItem(id: $id) {
            id
        }
    }
`


const Index = (
    {user}: Props
) => {

    const { data: todos, error: listError } = useQuery(Get_TODOs);
    const [deleteTodo, { loading: deleteLoading }] = useMutation(DELETE_TODO, {
        update(cache, { data: { deleteTodoItem } }) {
            const existingTodos = cache.readQuery<{ getTodoLists: todos_type[] }>({ query: Get_TODOs });

            if (existingTodos) {
                cache.writeQuery({
                    query: Get_TODOs,
                    data: {
                        getTodoLists: existingTodos.getTodoLists.filter(todo => todo.id !== deleteTodoItem.id),
                    },
                });
            }
        },
    });


    const OnDeleteClick = async (itemID: string) => {
        console.log("click", itemID);

        try {

            await deleteTodo({
                variables: {
                    id: itemID,
                }
            })

        }
        catch (error) {
            console.error(error);
        }
    }

    if (listError) {
        return (
            <div
                className={'border'}
            >
                {listError.message}
            </div>
        )
    }

    return (
        <div className="grid gap-2">

            {
                todos ?
                    todos.getTodoLists
                        .map((todo: todos_type) => (
                        <div
                            key={todo.id}
                            className={'flex items-center gap-2 p-2 rounded-lg shadow-md bg-gray-100'}
                        >
                            <div className="grow space-y-2">
                                <h4 className="text-lg font-semibold">{todo.title}</h4>
                                <p
                                    className={'mx-2'}
                                >{todo.description}</p>
                            </div>

                            {
                                // Check if the user has permission to delete the todo_item
                                ValidatePermissions(user.role, 'TODO', 'DELETE') &&
                                (
                                    <Button
                                        onClick={() => OnDeleteClick(todo.id)}
                                    >
                                        {
                                            deleteLoading ? 'Deleting...' : 'Delete'
                                        }
                                    </Button>
                                )
                            }
                        </div>
                    ))
                :
                    <div
                        className={'border'}
                    >
                        Loading
                    </div>
            }
        </div>
    )
}

export default Index;