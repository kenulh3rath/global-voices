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
        role: String!
    }

    type UserLogin {
        email: ID!,
        password: String!,
        attempts: Int!,
        user: User!
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
        getUserByEmail(email: String!): User  # Get user by email
        getUserLoginByEmail(email: String!): UserLogin  # Get user login by email
        
        getTodoLists: [TodoList]  # Get all todo_lists
        getTodoListByID(id: ID!): TodoList  # Get todo_list by ID
    }
    
    type Mutation {
        createUser(
            firstName: String!,
            lastName: String!,
            email: String!
        ): User!  # Create a new user
        
        createUserLogin(
            email: ID!,
            password: String!,
        ): UserLogin!  # Create a new user login
        
        deleteUserByEmail(email: String!): User!  # Delete user by email
        
        updateUserRoleByID(
            id: ID!,
            role: String!
        ): User!  # Update user role by ID
        
        updateLoginAttemptsByEmail(
            email: String!,
            attempts: Int!
        ): UserLogin!  # Update user login attempts by email
        
        createTodoList(
            title: String!,
            description: String!,
            userID: ID!
        ): TodoList!  # Create a new todo_list
        
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

        // Get User by Email
        getUserByEmail: async (
            _parent,
            args) => {
            const { email } = args
            return prisma.user.findUnique({
                where: {
                    email: email
                }
            })
        },

        // Get User Login by Email
        getUserLoginByEmail: async (
            _parent,
            args) => {
            const { email } = args
            return prisma.userLogin.findUnique({
                where: {
                    email: email
                },
                include: {
                    user: true
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
        createUser: async (_parent, args) => {
            const { firstName, lastName, email } = args

            return prisma.user.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                }
            })

        },

        /** Create User Login **/
        createUserLogin: async (_parent, args) => {
            const { email, password } = args
            return prisma.userLogin.create({
                data: {
                    email: email,
                    password: password
                }
            })
        },

        /** Delete User by Email **/
        deleteUserByEmail: async (_parent, args) => {
            const { email } = args

            // Delete User Login
            await prisma.userLogin.delete({
                where: {
                    email: email
                },
            })

            // Delete User
            const deleteUser = await prisma.user.delete({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            })

            return {
                id: deleteUser.id,
                firstName: deleteUser.firstName,
                lastName: deleteUser.lastName,
                email: deleteUser.email
            }
        },

        /** Update User Role by ID **/
        updateUserRoleByID: async (_parent, args) => {
            const { id, role } = args
            return prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    role: role
                }
            })
        },

        /** Update User Login Attempts by Email **/
        updateLoginAttemptsByEmail: async (_parent, args) => {
            const { email, attempts } = args
            return prisma.userLogin.update({
                where: {
                    email: email
                },
                data: {
                    attempts: attempts
                }
            })
        },

        /** Create Todo_list **/
        createTodoList: async (_parent, args) => {
            const { title, description, userID } = args
            return prisma.todoList.create({
                data: {
                    title: title,
                    description: description,
                    userId: userID
                }
            })
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