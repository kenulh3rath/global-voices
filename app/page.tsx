import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import DeleteButton from "@/app/components/deleteButton";
import {ValidatePermissions} from "@/lib/authz";

const Get_TODOs = gql`
    query GetTODOs {
        getTodoLists {
            id
            title
            description
        }
    }
`

export default async function Home() {

    // Get TODOs
    const { data: todos } = await client.query({ query: Get_TODOs });

    // Define Todo_types
    type todos_type = {
        id: string
        title: string
        description: string
    }

    const user = {
        name: 'John Doe',
        age: 30,
        email: 'test@test.dev',
        role: 'admin'
    }

    console.log(user);
    console.log(ValidatePermissions(user.role, 'TODO', 'DELETE'));


  return (
    <div
        className={'flex justify-center items-center w-screen h-screen'}
    >

        <div
            className={'w-3/4 p-2 rounded-lg shadow-2xl space-y-4'}
        >

            <h3 className="text-4xl text-center font-bold">
                TODO
            </h3>

            <div className="grid gap-2">
                {
                    todos.getTodoLists.map((todo: todos_type) => (
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
                                    <DeleteButton
                                        itemID={todo.id}
                                    />
                                )
                            }
                        </div>
                    ))
                }
            </div>

        </div>
    </div>
  );
}
