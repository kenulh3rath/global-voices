'use client'

import {FormEvent, useState} from "react";
import { useRouter } from 'next/navigation'
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import { gql, useMutation } from "@apollo/client";
import {HashPassword} from "@/app/actions/authConfigs";
import InputWithLabel from "@/components/inputWithLabel";
import Link from "next/link";


// ~~~~~ Queries ~~~~~

// Create new user
const NewUser = gql`
    mutation CreateUser($firstName: String!, $lastName: String!, $email: String!) {
        createUser(firstName: $firstName, lastName: $lastName, email: $email) {
            email
        }
    }
`

// Create new user login
const CreateUserLogin = gql`
    mutation CreateUserLogin($email: ID!, $password: String!) {
        createUserLogin(email: $email, password: $password) {
            email
        }
    }
`

const Page = () => {

    // ~~~~~ Hooks ~~~~~
    const router = useRouter();

    // ~~~~~ Query calls ~~~~~
    const [createUser] = useMutation(NewUser);
    const [createUserLogin] = useMutation(CreateUserLogin);

    // ~~~~~ States ~~~~~
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    // Create new user
    const HandleSignIn = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        setLoading(true)
        setError(undefined)

        // Another validation to check if password and confirm password are the same
        if (password !== passwordConfirm) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        const hashedPassword = await HashPassword(password)

        try {

            // Create new user
            await createUser({
                variables: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                }
            })

            // Create new user login
            await createUserLogin({
                variables: {
                    email: email,
                    password: hashedPassword
                }
            })

            // Notify user
            toast('User created successfully', {
                duration: 2000
            })

            // Redirect to login page
            router.push('/login')

        }
        catch (error) {
            console.error(error)
            setError('An error occurred')
            setLoading(false)
        }

    }

    return (
        <form
            onSubmit={HandleSignIn}
            className={'flex h-screen w-screen items-center justify-center'}
        >

            <div
                className="sm:w-1/5 w-4/5 p-5 rounded-2xl space-y-4 bg-slate-50/80 shadow-lg"
            >

                <p
                    className={'text-center text-2xl sm:text-4xl font-bold'}
                >
                    TO-DO
                </p>

                <p
                    className={'text-center text-xl sm:text-2xl font-bold'}
                >
                    Register
                </p>

                <p
                    className={'text-center text-sm'}
                >
                    Contact Admin to get Admin access
                </p>

                <div className="grid grid-cols-2 gap-4 space-y-2">

                    {/* First Name input */}
                    <InputWithLabel
                        id={'firstName'}
                        type={'text'}
                        label={'First Name'}
                        placeholder={'John'}
                        required={true}
                        rootClassName={'col-span-2 sm:col-span-1'}
                        labelClassName={'sm:text-lg'}
                        inputClassName={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                        value={firstName}
                        setValue={setFirstName}
                    />


                    {/* Last Name input */}
                    <InputWithLabel
                        id={'lastName'}
                        type={'text'}
                        label={'Last Name'}
                        placeholder={'Doe'}
                        required={true}
                        rootClassName={'col-span-2 sm:col-span-1'}
                        labelClassName={'sm:text-lg'}
                        inputClassName={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                        value={lastName}
                        setValue={setLastName}
                    />

                    {/* Email input */}
                    <InputWithLabel
                        id={'email'}
                        type={'email'}
                        label={'Email'}
                        placeholder={'johndoe@user.dev'}
                        required={true}
                        rootClassName={'col-span-2'}
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
                        rootClassName={'col-span-2'}
                        labelClassName={'sm:text-lg'}
                        inputClassName={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                        value={password}
                        setValue={setPassword}
                    />

                    {/* Confirm Password input */}
                    <InputWithLabel
                        id={'passwordConfirm'}
                        type={'password'}
                        label={'Confirm Password'}
                        placeholder={'********'}
                        required={true}
                        rootClassName={'col-span-2'}
                        labelClassName={'sm:text-lg'}
                        inputClassName={'w-full p-2 border rounded-lg focus:outline-none focus:border-slate-500'}
                        value={passwordConfirm}
                        setValue={setPasswordConfirm}
                    >
                        {
                            error &&
                            <p
                                className={'text-red-500'}
                            >
                                {error}
                            </p>
                        }
                        <p
                            className={'text-xs sm:text-sm text-center text-slate-500'}
                        >
                            Password must be at least 6 characters long
                        </p>
                    </InputWithLabel>

                </div>

                <Button
                    type={'submit'}
                    // onClick={HandleLogin}
                    className={'flex mx-auto w-2/3 p-2  rounded-lg'}

                    // Validations
                    disabled={
                        loading ||
                        !email ||
                        !password ||
                        !passwordConfirm ||
                        password !== passwordConfirm ||
                        password.length < 6 ||
                        firstName === '' ||
                        lastName === '' ||
                        email === '' ||
                        password === '' ||
                        passwordConfirm === ''
                    }
                >
                    {
                        loading ? 'Loading...' : 'Login'
                    }
                </Button>

                {/* Log In */}
                <div
                    className={'text-center'}
                >
                    <p
                        className={'text-sm sm:text-base'}
                    >
                        Already have an account?
                    </p>
                    <Link
                        href={'/login'}
                        className={'underline text-sm sm:text-lg'}
                    >
                        Log In
                    </Link>
                </div>

            </div>


        </form>
    )
}

export default Page;