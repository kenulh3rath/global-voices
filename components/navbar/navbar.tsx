import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Dropdown from "@/components/navbar/dropdown";
import Link from "next/link";

const Index = async () => {

    const session: { user: { role: string, id: string, firstName: string, lastName: string } } | null = await getServerSession(authOptions)

    return (
        <div className="w-full p-5 flex items-center justify-between">

            <Link
                href={'/'}
                className={'text-xl font-semibold'}
            >
                TO-DO
            </Link>

            <Dropdown
                role={session?.user?.role || 'VIEWER'}
                firstName={session?.user?.firstName || ''}
                lastName={session?.user?.lastName || ''}
            />
        </div>
    )
}

export default Index;