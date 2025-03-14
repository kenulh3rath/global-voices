import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '@/lib/apolloClient'
import { gql } from '@apollo/client'

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

                console.log('Credentials', credentials)

                // Get user from database
                const {data} = await client.query({
                    query: GetUserLogin,
                    variables: {
                        email: credentials.email
                    }
                })

                console.log('Data', data)
                console.log('Data.getUserLoginByEmail', data.getUserLoginByEmail)

                // If user not found
                if (!data.getUserLoginByEmail) {
                    return null
                }
                console.log('Data.getUserLoginByEmail', data.getUserLoginByEmail)

                // const user = await prisma.user.findUnique({
                //     where: {
                //         email: credentials.email
                //     }
                // })

                // if (!user) {
                //     return null
                // }

                const user = data.getUserLoginByEmail

                // const isPasswordValid = await compare(
                //     credentials.password,
                //     user.password
                // )

                const isPasswordValid = credentials.password === user.password

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.user.id + '',
                    email: user.email,
                    name: user.name,
                    role: user.user.role,
                    randomKey: 'Hey cool'
                }
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            console.log('Session Callback', { session, token })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    randomKey: token.randomKey
                }
            }
        },
        jwt: ({ token, user }) => {
            console.log('JWT Callback', { token, user })
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: u.id,
                    role: u.role,
                    randomKey: u.randomKey
                }
            }
            return token
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }