"use client";

import { Mail, Lock, User, Phone, IdCard } from "lucide-react";
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-2 px-2 my-4">
                <p className="font-bold text-3xl">Create an Account</p>
                <p className="text-sm text-black/60">Fill in the form below to register</p>
            </div>

            {/**register form */}
            <form method="POST" className="flex flex-col gap-2 px-2">

                {/**first and last */}
                <div className="flex flex-row justify-between w-full">
                    <label className="input my-2">
                        <User className="w-4 h-4" />
                        <input type="text" className="bg-gray-200 p-2" placeholder="First" />
                    </label>
                    <label className="input my-2">
                        <User className="w-4 h-4" />
                        <input type="text" className="bg-gray-200 p-2" placeholder="Last" />
                    </label>
                </div>

                {/**email */}
                <label className="input my-2 w-full">
                    <Mail className="w-4 h-4" />
                    <input type="text" className="bg-gray-200 p-2" placeholder="Email Id" />
                </label>

                {/**student id */}
                <label className="input my-2 w-full">
                    <IdCard className="w-4 h-4" />
                    <input type="text" className="bg-gray-200 p-2" placeholder="Student ID" />
                </label>

                {/**phone */}
                <label className="input my-2 w-full">
                    <Phone className="w-4 h-4" />
                    <input type="text" className="bg-gray-200 p-2" placeholder="Email Id" />
                </label>

                {/**password */}
                <label className="input my-2 w-full">
                    <Lock className="w-4 h-4" />
                    <input type="password" className="grow bg-gray-200 p-2" placeholder="Password" />
                </label>

                {/**confirm password */}
                <label className="input my-2 w-full">
                    <Lock className="w-4 h-4" />
                    <input type="password" className="grow bg-gray-200 p-2" placeholder="Confirm Password" />
                </label>

                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-primary bg-blue-600 text-white rounded-md border-0 my-2" type="submit">Register</button>
            </form>
            {/**Sign in prompt */}
            <div className="flex flex-row gap-2 items-center my-4">
                <p className="text-md">Already have an account? </p>
                <Link href="/auth/login/"  className="text-blue-600 text-md underline">Login</Link>
            </div>
        </div >
    )
}