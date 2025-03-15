'use client'

import {Button} from "@/components/ui/button";
import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import { useRouter } from 'next/navigation'
import {toast} from "sonner";

const Page = () => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const HandleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        setError(undefined)

        try {
            const res = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
                callbackUrl: '/' // redirect to home page
            })

            if (!res?.error) {
                toast('Welcome Back!', {
                    duration: 2000
                })
                router.push('/')
            }
            else {
                setError(res.error)
            }
        }
        catch (e) {
            console.error(e)
            setError('Invalid email or password')
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={HandleLogin}
            className={'flex h-screen w-screen items-center justify-center'}
        >
            
            <div
                className="w-2xl p-5 rounded-2xl space-y-4 bg-slate-50/80 shadow-lg"
            >

                <p
                    className={'text-center text-4xl font-bold'}
                >
                    TO-DO
                </p>

                <div className="space-y-2">

                    <div className="">
                        <label
                            htmlFor={'email'}
                            className={'text-lg'}
                        >
                            Email
                        </label>
                        <input
                            id={'email'}
                            name={'email'}
                            type="email"
                            className={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                            autoComplete={'off'}
                            required={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="">
                        <label
                            htmlFor={'password'}
                            className={'text-lg'}
                        >
                            Password
                        </label>
                        <input
                            id={'password'}
                            name={'password'}
                            type="password"
                            className={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                            autoComplete={'off'}
                            required={true}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {
                            error &&
                            <p
                                className={'text-red-500'}
                            >
                                {error}
                            </p>
                        }
                    </div>

                </div>

                <Button
                    type={'submit'}
                    // onClick={HandleLogin}
                    className={'flex mx-auto w-2/3 p-2  rounded-lg'}
                    disabled={loading}
                >
                    {
                        loading ? 'Loading...' : 'Login'
                    }
                </Button>

            </div>
            
        </form>
    )
}

export default Page;