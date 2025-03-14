
import List from "@/app/components/list";


export default async function Home() {


    const user = {
        name: 'John Doe',
        age: 30,
        email: 'test@test.dev',
        role: 'admin'
    }


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
                    user={user}
                />

            </div>
        </div>
    );
}
