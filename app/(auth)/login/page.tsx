'use client'

import {Button} from "@/components/ui/button";
import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import { useRouter } from 'next/navigation'
import {toast} from "sonner";
import Link from "next/link";
import InputWithLabel from "@/components/inputWithLabel";

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
                setLoading(false)
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
                className="sm:w-1/5 w-4/5 p-10 rounded-2xl space-y-2 sm:space-y-4 bg-slate-50/80 shadow-lg"
            >

                <p
                    className={'text-center text-2xl sm:text-4xl font-bold'}
                >
                    TO-DO
                </p>

                <p
                    className={'text-center text-xl sm:text-2xl font-bold'}
                >
                    Login
                </p>

                <div className="space-y-2">

                    {/* Email input */}
                    <InputWithLabel
                        id={'email'}
                        type={'email'}
                        label={'Email'}
                        placeholder={'johndoe@user.dev'}
                        required={true}
                        labelClassName={'sm:text-lg'}
                        inputClassName={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                        value={email}
                        setValue={setEmail}
                    />

                    {/* Password input */}
                    <InputWithLabel
                        id={'password'}
                        type={'password'}
                        label={'Password'}
                        placeholder={'********'}
                        required={true}
                        labelClassName={'sm:text-lg'}
                        inputClassName={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                        value={password}
                        setValue={setPassword}
                    >
                        {
                            error &&
                            <p
                                className={'text-red-500'}
                            >
                                {error}
                            </p>
                        }
                    </InputWithLabel>

                </div>

                <Button
                    type={'submit'}
                    // onClick={HandleLogin}
                    className={'flex mx-auto w-2/3 p-2  rounded-lg'}
                    disabled={
                        loading ||
                        !email ||
                        !password
                    }
                >
                    {
                        loading ? 'Loading...' : 'Login'
                    }
                </Button>

                {/* Sign Up */}
                <div
                    className={'text-center'}
                >
                    <p
                        className={'text-sm sm:text-base'}
                    >
                        Don't have an account?
                    </p>
                    <Link
                        href={'/sign-up'}
                        className={'underline text-sm sm:text-lg'}
                    >
                        Sign Up
                    </Link>
                </div>

            </div>

        </form>
    )
}

export default Page;