'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clsx from "clsx";
import { signOut} from "next-auth/react";

interface Props {
    role: string,
    firstName: string,
    lastName: string
}

const Index = (
    {role, firstName, lastName}: Props
) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={clsx("flex size-10 rounded-full justify-center items-center font-semibold ", {
                    'bg-yellow-500 text-white': role === 'ADMIN',
                    'bg-gray-500 text-white': role === 'VIEWER',
                })}
            >
                {
                    firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Manage Users</DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => signOut()}
                >
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default Index;