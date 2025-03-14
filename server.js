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
    
    type Query {
        getUsers: [User]!  # Get all users
        getUserByID(id: ID!): User  # Get user by ID
    }
    
    type Mutation {
        createUser(
            firstName: String!,
            lastName: String!,
            email: String!
        ): User!  # Create a new user
    }

`

// GraphQL Resolvers
const Resolvers = {
    Query: {
        getUsers: async () => {
            // return users
            return prisma.user.findMany({})
        },
        getUserByID: async (
            _parent,
            args) => {
            const { id } = args
            // return users.find((user) => user.id === id)
            return prisma.user.findUnique({
                where: {
                    id: id
                }
            })
        }
    },
    Mutation: {
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