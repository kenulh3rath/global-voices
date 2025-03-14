
import List from "@/app/components/list";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'


export default async function Home() {

    const session = await getServerSession(authOptions)


    return (
        <div
            className={'flex justify-center items-center w-screen h-screen'}
        >

            <div
                className={'w-3/4 h-5/6 p-2 rounded-lg shadow-2xl space-y-4'}
            >

                <h3 className="text-4xl text-center font-bold">
                    {"TODO"}
                </h3>

                <List
                    role={session?.user?.role || 'VIEWER'}
                />

            </div>

        </div>
    );
}
