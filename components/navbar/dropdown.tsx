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
import Link from "next/link";

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
                    'bg-blue-500 text-white': role === 'CREATOR',
                })}
            >
                {
                    firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    role === 'ADMIN' && (
                        <DropdownMenuItem asChild={true}>
                            <Link
                                href={'/manage'}
                                className={'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4'}
                            >
                                Manage Users
                            </Link>

                        </DropdownMenuItem>
                    )
                }
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