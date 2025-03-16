import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '@/lib/apolloClient'
import { gql } from '@apollo/client'

const USER_LOGIN_ATTEMPTS = 5

type userLogin = {
    email: string
    password: string
    attempts: number
    user: {
        id: string
        firstName: string
        lastName: string
        role: string
    }
}

// GraphQL Query
const GetUserLogin = gql`
    query GetUserLoginByEmail($email: String!) {
        getUserLoginByEmail(email: $email) {
            email
            password
            attempts
            user {
                id
                firstName
                lastName
                role
            }
        }
    }
`


// Update user login attempts
const UpdateLoginAttemptsByEmail = gql`
    mutation UpdateLoginAttemptsByEmail($email: String!, $attempts: Int!) {
        updateLoginAttemptsByEmail(email: $email, attempts: $attempts) {
            email
        }
    }
`

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'hello@example.com'
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {



                // Missing credentials
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Missing credentials')
                }

                // Get user from database
                const {data} = await client.query({
                    query: GetUserLogin,
                    variables: {
                        email: credentials.email
                    },
                    fetchPolicy: 'no-cache'
                })

                // If user not found
                if (!data.getUserLoginByEmail) {
                    throw new Error('Invalid email or password')
                }

                const user: userLogin = data.getUserLoginByEmail

                // ~~~~~~ Mutation ~~~~~~
                // const {data} = await client.mutate({
                //     mutation: UpdateLoginAttemptsByEmail,
                //     fetchPolicy: 'no-cache'
                // })

                // Check password
                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )

                // If password is invalid
                if (!isPasswordValid) {

                    // Check if user has reached the maximum login attempts
                    if (user.attempts >= USER_LOGIN_ATTEMPTS || (user.attempts + 1) === USER_LOGIN_ATTEMPTS) {
                        throw new Error('Login attempts exceeded. Please Contact Support')
                    }

                    // Update login attempts
                    await client.mutate({
                        mutation: UpdateLoginAttemptsByEmail,
                        variables: {
                            email: credentials.email,
                            attempts: user.attempts + 1
                        },
                        fetchPolicy: 'no-cache'
                    })

                    throw new Error('Invalid password. You have ' + (USER_LOGIN_ATTEMPTS - (user.attempts + 1)) + ' attempts left')
                }

                // Reset login attempts
                await client.mutate({
                    mutation: UpdateLoginAttemptsByEmail,
                    variables: {
                        email: credentials.email,
                        attempts: 0
                    },
                    fetchPolicy: 'no-cache'
                })

                return {
                    id: user.user.id + '',
                    email: user.email,
                    firstName: user.user.firstName,
                    lastName: user.user.lastName,
                    role: user.user.role,
                }
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    role: token.role,
                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as { id: string, role: string, firstName: string, lastName: string }
                return {
                    ...token,
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    role: u.role,
                }
            }
            return token
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }