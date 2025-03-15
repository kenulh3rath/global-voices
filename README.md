# Description

This is a simple To-Do List application that demonstrates,
- CRUD operations using GraphQL
- Authentication using NextAuth
- Authorization using a basic RBAC (Role-Based Access Control) system

### User Types

- **ADMIN**
- **CREATOR**
- **VIEWER**

### User Permissions

- **Admin**
  - `Create`, `Read` and `Delete` To-Do Items
  - `Read` All Users
  - `Update` User Role
  - `Delete` a User

- **Creator**
  - `Create` and `Read` To-Do Items

- **Viewer**
  - `Read` To-Do Items

### File Structure

+ `global-voices/server.js` - GraphQL Server
+ `global-voices/lib/apolloClient.ts` - Apollo Client
+ `global-voices/lib/prisma.ts` - Prisma Client
+ `global-voices/lib/authz.ts` - Authorization Policies



---

**Note:** For simplicity, I'm running GraphQL (Apollo) server and Next.js server in the same node.js process.

- Next.js - port `3000`
- GraphQL - port `4000`


---


## Tech Stack

- [Next.js](https://nextjs.org) - Framework
- [Prisma](https://prisma.io) - Database ORM
- [GraphQL](https://graphql.org) - Query Language
- [Apollo Client](https://www.apollographql.com/docs/react) - GraphQL Client
- [ShadCn](https://shadcn.com) - Ready-to-use UI Components
- [SQLite](https://sqlite.org) - Database
- [TypeScript](https://www.typescriptlang.org) - Primary Language
- [TailwindCSS](https://tailwindcss.com) - CSS Framework
- [NextAuth](https://next-auth.js.org) - Authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password (Hashing, Comparing)
- [React Icons](https://react-icons.github.io/react-icons) - Icons

---

### Install Dependencies

Run the following command to install dependencies

```bash
  npm install
```


### Apollo Server

Run the following command to start the Apollo Server:

```bash
  npm run graphql
```


### Start the Development Server

Run the following command to start the development server:

```bash
  npm run dev
```

