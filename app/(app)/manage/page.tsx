import UserList from "@/app/(app)/manage/components/userList";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import {permanentRedirect} from "next/navigation";


const Page = async () => {

    const session: { user: { role: string} } | null = await getServerSession(authOptions)

    if (session?.user?.role !== "ADMIN") {
        permanentRedirect('/')
    }

    return (
        <div
            className={'p-2 space-y-4'}
        >
            <h1
                className={'text-2xl font-semibold'}
            >
                Users
            </h1>


            <UserList />

        </div>
    )
}

export default Page;