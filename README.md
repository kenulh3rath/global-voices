# Description

This is a simple To-Do List application that demonstrates,
- CRUD operations using GraphQL
- Authentication using NextAuth
- Authorization using a basic RBAC (Role-Based Access Control) system

---

### Requirements Met

- [x] **Built using Next.js**
- [x] **Used GraphQL for database communication**
- [x] **Used Prisma for ORM through GraphQL**
- [x] **Used SQLite for database**
- [x] **Used bcrypt for password hashing**
- [x] **Used NextAuth for authentication**
- [x] **Implemented password hashing and salting**
- [x] **Implemented user-friendly interface for registration, login, and logout**
- [x] **Locked the user out of the account after 5 incorrect login attempts**
- [x] **Provided loading indicators during API requests**

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

### Users

| First Name | Last Name   | Role    | Email                      | Password    |
|------------|-------------|---------|----------------------------|-------------|
| Falito     | Lovejoy     | ADMIN   | flovejoy0@shutterfly.com   | ceWP53"@_Os |
| Nealy      | Rowat       | CREATOR | nrowat1@flavors.me         | paAB56"     |
| Krissy     | Gooderridge | CREATOR | kgooderridge2@columbia.edu | oaYY07$     |
| Lynn       | Agates      | VIEWER  | lagates3@mapquest.com      | swFU40,     |
| Steven     | Baiyle      | VIEWER  | sbaiyle4@furl.net          | yzVR59~S    |
| Tammy      | Aldis       | VIEWER  | taldis5@ycombinator.com    | rqPZ93>     |

> Generated using [Mockaroo](https://mockaroo.com)

---

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

