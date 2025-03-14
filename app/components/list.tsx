'use client'

import { useQuery, useMutation, gql } from "@apollo/client";
import {ValidatePermissions} from "@/lib/authz";
import {Button} from "@/components/ui/button";
import {useState} from "react";

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

    const [listItem, setListItem] = useState<string>('')

    const OnCreateClick = async () => {
        try {
            await createTodo({
                variables: {
                    title: 'New Todo',
                    description: 'New Todo Description',
                    userID: "cm88iy3u70000wo7cq7ep5z1j"
                }
            })
        }
        catch (error) {
            console.log(error);
            console.error(error);
        }
    }

    const OnDeleteClick = async (itemID: string) => {
        
        try {
            setListItem(itemID);

            await deleteTodo({
                variables: {
                    id: itemID,
                }
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
        <div className="grid gap-2">
            {
                // Check if the user has permission to create a new todo_item
                ValidatePermissions(user.role, 'TODO', 'CREATE') &&
                (
                    <Button
                        onClick={OnCreateClick}
                    >
                        Create
                    </Button>
                )
            }

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