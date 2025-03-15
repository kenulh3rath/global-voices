'use server'

import { hash } from "bcrypt";

const HashPassword = async (password: string) => {
    return await hash(password, Number(process.env.SALT_ROUNDS || 10))
}

export {
    HashPassword
}