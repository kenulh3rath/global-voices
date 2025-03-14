'use client'

import {useState} from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {ValidatePermissions} from "@/lib/authz";
import {Button} from "@/components/ui/button";
import { toast } from "sonner"


interface Props {
    user: {
        name: string
        age: number
        email: string
        role: string
    }
}

// Todo_item types
type todos_type = {
    id: string
    title: string
    description: string
}

// Get all todo_items
const Get_TODOs = gql`
    query GetList {
        getTodoLists {
            id
            title
            description
        }
    }
`

// Delete a todo_item
const DELETE_TODO = gql`
    mutation DeleteTODO($id: ID!) {
        deleteTodoItem(id: $id) {
            id
        }
    }
`

// Create a new todo_item
const CREATE_TODO = gql`
    mutation createTODO($title: String!, $description: String!, $userID: ID!) {
        createTodoList(title: $title, description: $description, userID: $userID) {
            title,
            description,
            id
        }
    }
`

const Index = (
    {user}: Props
) => {

    // ~~~~ Queries and Mutations ~~~~
    const { data: todos, error: listError } = useQuery(Get_TODOs);
    const [deleteTodo] = useMutation(DELETE_TODO, {
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
    const [createTodo] = useMutation(CREATE_TODO, {
        update(cache, { data: { createTodoList } }) {
            const existingTodos = cache.readQuery<{ getTodoLists: todos_type[] }>({ query: Get_TODOs });

            if (existingTodos) {
                cache.writeQuery({
                    query: Get_TODOs,
                    data: {
                        getTodoLists: [...existingTodos.getTodoLists, createTodoList],
                    },
                });
            }
        },
    });

    // ~~~~ States ~~~~
    const [listItem, setListItem] = useState<string>('')

    // Add a new todo_item
    const OnCreateClick = async () => {
        try {
            await createTodo({
                variables: {
                    title: 'New Todo',
                    description: 'New Todo Description',
                    userID: "cm88iy3u70000wo7cq7ep5z1j"
                }
            })

            // Notify user
            toast('Todo created successfully', {
                duration: 2000,
            })

        }
        catch (error) {
            console.log(error);
            console.error(error);
        }
    }


    // Delete a todo_item
    const OnDeleteClick = async (itemID: string) => {

        try {
            setListItem(itemID);

            await deleteTodo({
                variables: {
                    id: itemID,
                }
            })

            // Notify user
            toast('Todo deleted successfully', {
                duration: 2000,
            })

        }
        catch (error) {
            console.error(error);
        }
        finally {
            setListItem('');
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
        <div className="grid gap-5">
            {
                // Check if the user has permission to create a new todo_item
                ValidatePermissions(user.role, 'TODO', 'CREATE') &&
                (
                    <Button
                        onClick={OnCreateClick}
                        className={'flex w-fit justify-self-end mr-2'}
                    >
                        Create
                    </Button>
                )
            }

            {
                // Check if the query returns
                todos ?
                    // If query returns null
                    todos.getTodoLists.length === 0 ?
                        <p
                            className={'text-center p-2 text-lg text-gray-600'}
                        >
                            Todo list is empty
                        </p>

                    // If query returns data
                    :
                        todos.getTodoLists.map((todo: todos_type) => (
                        <div
                            key={todo.id}
                            className={'flex items-center gap-2 p-2 rounded-lg shadow-md bg-gray-50 duration-200 ease-in-out hover:bg-gray-100'}
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
                                        disabled={listItem === todo.id}
                                    >
                                        {
                                            listItem === todo.id ? 'Deleting...' : 'Delete'
                                        }
                                    </Button>
                                )
                            }
                        </div>
                    ))
                // while querying
                :
                    <p
                        className={'text-center p-2 text-gray-600'}
                    >
                        Loading
                    </p>
            }
        </div>
    )
}

export default Index;