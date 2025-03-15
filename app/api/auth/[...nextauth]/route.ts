import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '@/lib/apolloClient'
import { gql } from '@apollo/client'

// GraphQL Query
const GetUserLogin = gql`
    query GetUserLoginByEmail($email: String!) {
        getUserLoginByEmail(email: $email) {
            email
            password
            user {
                id
                firstName
                lastName
                role
            }
        }
    }
`

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
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
                    return null
                }

                // Get user from database
                const {data} = await client.query({
                    query: GetUserLogin,
                    variables: {
                        email: credentials.email
                    }
                })

                // If user not found
                if (!data.getUserLoginByEmail) {
                    return null
                }

                const user = data.getUserLoginByEmail

                // Check password
                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )

                // If password is invalid
                if (!isPasswordValid) {
                    return null
                }

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