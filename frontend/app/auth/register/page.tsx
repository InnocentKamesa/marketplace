"use client";

import { Mail, Lock, User, Phone, IdCard } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from 'react-phone-number-input';

const API_URL = "http://127.0.0.1:5000/api"

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        first: "",
        last: "",
        email: "",
        phone: "+265",
        password: "",
        confirm: "",
        studentId: ""
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    };

    const validateForm = () => {
        if (form.password !== form.confirm) {
            alert("Passwords do not match");
            return false;
        }
        if (!form.first || !form.last || !form.email || !form.phone || !form.password || !form.confirm || !form.studentId) {
            alert("Please fill in all fields");
            return false;
        }

        //phone validation
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(form.phone)) {
            alert("Provided phone not valid")
        }
        return true;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);

        //validation
        if (!validateForm()) {
            throw new Error("Validation failed");
        };

        try {
            const response = await fetch(`${API_URL}/auth/register/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const error = await response.json();
                if (response.status === 400) {
                    console.log(error.error)
                }
                throw new Error("Server did not return success")
            }
            setTimeout(() => {
                router.push("/dashboard")
            }, 3000);
        }
        catch (error) {
            console.error(error)
        }
    }


    return (
        <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-2 px-2 my-4">
                <p className="font-bold text-3xl">Create an Account</p>
                <p className="text-sm text-black/60">Fill in the form below to register</p>
            </div>

            {/**register form */}
            <form method="POST" className="flex flex-col gap-2 px-2" onSubmit={onSubmit}>

                {/**first and last */}
                <div className="flex flex-row justify-between w-full">
                    <label className="input my-2">
                        <User className="w-4 h-4" />
                        <input type="text" name="first" value={form.first} onChange={onChange} className="bg-gray-200 p-2" placeholder="First" />
                    </label>
                    <label className="input my-2">
                        <User className="w-4 h-4" />
                        <input type="text" name="last" value={form.last} onChange={onChange} className="bg-gray-200 p-2" placeholder="Last" />
                    </label>
                </div>

                {/**email */}
                <label className="input my-2 w-full">
                    <Mail className="w-4 h-4" />
                    <input type="text" name="email" value={form.email} onChange={onChange} className="bg-gray-200 p-2" placeholder="Email Id" />
                </label>

                {/**student id */}
                <label className="input my-2 w-full">
                    <IdCard className="w-4 h-4" />
                    <input type="text" name="studentId" value={form.studentId} onChange={onChange} className="bg-gray-200 p-2" placeholder="Student ID" />
                </label>

                {/**phone */}
                <label className="input my-2 w-full">
                    <Phone className="w-4 h-4" />
                     <input type="phone" name="phone" value={form.phone} onChange={onChange} className="grow bg-gray-200 p-2" placeholder="Should start with +" />
                   
                </label>

                {/**password */}
                <label className="input my-2 w-full">
                    <Lock className="w-4 h-4" />
                    <input type="password" name="password" value={form.password} onChange={onChange} className="grow bg-gray-200 p-2" placeholder="Password" />
                </label>

                {/**confirm password */}
                <label className="input my-2 w-full">
                    <Lock className="w-4 h-4" />
                    <input type="password" name="confirm" value={form.confirm} onChange={onChange} className="grow bg-gray-200 p-2" placeholder="Confirm Password" />
                </label>

                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-primary bg-blue-600 text-white rounded-md border-0 my-2" type="submit">Register</button>
            </form>
            {/**Sign in prompt */}
            <div className="flex flex-row gap-2 items-center my-4">
                <p className="text-md">Already have an account? </p>
                <Link href="/auth/login/" className="text-blue-600 text-md underline">Login</Link>
            </div>
        </div >
    )
}