
import List from "@/app/(app)/components/list";
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'


export default async function Home() {

    // Get the user session
    const session: { user: { role: string, id: string } } | null = await getServerSession(authOptions)


    return (
        <div
            className={'flex justify-center items-center h-screen'}
        >

            <div
                className={'w-full sm:w-3/4 h-5/6 p-2 rounded-lg shadow-2xl space-y-4'}
            >

                <h3 className="text-2xl sm:text-4xl text-center font-bold">
                    TO-DO
                </h3>

                <List
                    role={session?.user?.role || 'VIEWER'}
                    userId={session?.user?.id || ''}
                />

            </div>

        </div>
    );
}
