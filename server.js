import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";

// Server Port
const PORT = process.env.PORT || 4000;

// Prisma Client
const prisma = new PrismaClient();

// Dummy Data
const users = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@test.com'
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@test.com',
    },
    {
        id: '3',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alicesmith@test.com'
    }
]

// GraphQL Schema
const TypeDefs = `#graphql

    type User {
        id: ID!,
        firstName: String!,
        lastName: String!,
        email: String!,
    }

    type TodoList {
        id: ID!,
        title: String!,
        description: String!,
        user: User!
    }
    
    type Query {
        getUsers: [User]  # Get all users
        getUserByID(id: ID!): User  # Get user by ID
        
        getTodoLists: [TodoList]  # Get all todo_lists
        getTodoListByID(id: ID!): TodoList  # Get todo_list by ID
    }
    
    type Mutation {
        createUser(
            firstName: String!,
            lastName: String!,
            email: String!
        ): User!  # Create a new user
        
        deleteTodoItem(id: ID!): TodoList!  # Delete a todo_item
    }

`

// GraphQL Resolvers
const Resolvers = {
    Query: {

        // Get Users
        getUsers: async () => {
            return prisma.user.findMany({})
        },

        // Get User by ID
        getUserByID: async (
            _parent,
            args) => {
            const { id } = args
            return prisma.user.findUnique({
                where: {
                    id: id
                }
            })
        },

        // Get Todo Lists
        getTodoLists: async () => {
            return prisma.todoList.findMany({
                include: {
                    user: true
                }
            })
        },

        // Get Todo List by ID
        getTodoListByID: async (
            _parent,
            args) => {
            const {id} = args
            return prisma.todoList.findUnique({
                where: {
                    id: id
                }
            })
        }
    },
    Mutation: {
        /** Create User **/
        createUser: (_parent, args) => {
            const { firstName, lastName, email } = args

            const newUser = {
                id: String(users.length + 1),
                firstName: firstName,
                lastName: lastName,
                email: email
            }
            users.push(newUser)
            return newUser
        },

        /**  Delete Todo_item **/
        deleteTodoItem: async (_parent, args) => {
            const { id } = args
            const deleteItem = await prisma.todoList.delete({
                where: {
                    id: id
                },
                select: {
                    id: true
                }
            })

            return {
                id: deleteItem.id
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs: TypeDefs,
    resolvers: Resolvers,
});

const {url} = await startStandaloneServer(server, {
    listen: {
        port: Number(PORT),
    }
})

console.log('Server Running at :', url);