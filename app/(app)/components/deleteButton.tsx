'use client'

// import client from "@/lib/apolloClient";
import {Button} from "@/components/ui/button";
import { useMutation, gql } from "@apollo/client";
interface Props {
    itemID: string
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
    {itemID}: Props
) => {



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


    const OnClick = async () => {
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

    return (
        <Button
            onClick={OnClick}
        >
            {
                deleteLoading ? 'Deleting...' : 'Delete'
            }
        </Button>
    )
}

export default Index;